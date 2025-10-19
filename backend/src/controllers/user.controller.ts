import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { hashAndSignEmail } from '../services/crypto.service';
import { serializeUserList } from '../services/protobuf.service';
import { getPublicKey } from '../utils/rsaKeys';
import { UpdateUserData, Role, Status } from '../types';
import { validateUserCreation, validateUserUpdate, sanitizeEmail } from '../utils/validation';

export async function createUser(req: Request, res: Response): Promise<void> {
  const { email, role, status } = req.body;

  // Validate input data
  const validation = validateUserCreation({ email, role, status });
  if (!validation.isValid) {
    throw new AppError(`Validation failed: ${validation.errors.join(', ')}`, 400);
  }

  // Sanitize email
  const sanitizedEmail = sanitizeEmail(email);

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: sanitizedEmail },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Hash email and generate signature
  const { emailHash, signature } = hashAndSignEmail(sanitizedEmail);

  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: sanitizedEmail,
      role: role || Role.USER,
      status: status || Status.ACTIVE,
      emailHash,
      signature,
    },
  });

  res.status(201).json({
    message: 'User created successfully',
    user
  });
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string) || '';
  const sortBy = (req.query.sortBy as string) || 'createdAt';
  const sortOrder = (req.query.sortOrder as string) || 'desc';
  const filterRole = req.query.filterRole as string;
  const filterStatus = req.query.filterStatus as string;

  const validatedPage = Math.max(1, page);
  const validatedLimit = Math.min(Math.max(1, limit), 100); 

  const where: any = {};

  if (filterRole && filterRole !== 'ALL') {
    where.role = filterRole;
  }

  if (filterStatus && filterStatus !== 'ALL') {
    where.status = filterStatus;
  }

  const validSortFields = ['email', 'role', 'status', 'createdAt', 'updatedAt'];
  const validatedSortBy = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const validatedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc';

  let allUsers = await prisma.user.findMany({
    where,
    orderBy: { [validatedSortBy]: validatedSortOrder },
  });

  // Apply case-insensitive search filter
  if (search) {
    const searchLower = search.toLowerCase();
    allUsers = allUsers.filter(user => 
      user.email.toLowerCase().includes(searchLower)
    );
  }

  // Calculate pagination
  const totalCount = allUsers.length;
  const totalPages = Math.ceil(totalCount / validatedLimit);
  const skip = (validatedPage - 1) * validatedLimit;
  const hasNextPage = validatedPage < totalPages;
  const hasPreviousPage = validatedPage > 1;

  // Apply pagination
  const users = allUsers.slice(skip, skip + validatedLimit);

  res.status(200).json({
    users,
    pagination: {
      currentPage: validatedPage,
      totalPages,
      totalCount,
      pageSize: validatedLimit,
      hasNextPage,
      hasPreviousPage,
    },
  });
}


export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({ user });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { email, role, status } = req.body;

  // Validate input data
  const validation = validateUserUpdate({ email, role, status });
  if (!validation.isValid) {
    throw new AppError(`Validation failed: ${validation.errors.join(', ')}`, 400);
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  // If email is being updated, regenerate hash and signature
  const updateData: UpdateUserData = {};

  if (email && email !== existingUser.email) {
    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Check if new email is already taken
    const emailTaken = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (emailTaken) {
      throw new AppError('Email already in use', 409);
    }

    const { emailHash, signature } = hashAndSignEmail(sanitizedEmail);
    updateData.email = sanitizedEmail;
    updateData.emailHash = emailHash;
    updateData.signature = signature;
  }

  if (role) updateData.role = role;
  if (status) updateData.status = status;

  // Update user
  const updatedUser = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  res.status(200).json({
    message: 'User Updated successfully',
    user: updatedUser,
    publicKey: getPublicKey(),
  });
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    throw new AppError('User not found', 404);
  }

  // Delete user
  await prisma.user.delete({
    where: { id },
  });

  res.status(200).json({ message: 'User deleted successfully'});
}

export async function exportUsers(req: Request, res: Response): Promise<void> {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // Serialize users to Protobuf
  const protobufData = serializeUserList(users);

  // Set appropriate headers
  res.setHeader('Content-Type', 'application/x-protobuf');
  res.setHeader('Content-Disposition', 'attachment; filename="users.pb"');
  res.setHeader('X-Public-Key', Buffer.from(getPublicKey()).toString('base64'));

  res.status(200).send(Buffer.from(protobufData));
}

export async function getPublicKeyEndpoint(req: Request, res: Response): Promise<void> {
  const publicKey = getPublicKey();
  res.status(200).json({ publicKey });
}
