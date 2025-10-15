import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashAndSignEmail } from '../services/crypto.service';
import { serializeUserList } from '../services/protobuf.service';
import { getPublicKey } from '../utils/rsaKeys';
import { UpdateUserData, Role, Status } from '../types';
import { validateUserCreation, validateUserUpdate, sanitizeEmail } from '../utils/validation';

const prisma = new PrismaClient();

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const { email, role, status } = req.body;

    // Validate input data
    const validation = validateUserCreation({ email, role, status });
    if (!validation.isValid) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
      return;
    }

    // Sanitize email
    const sanitizedEmail = sanitizeEmail(email);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists' });
      return;
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
      user,
      publicKey: getPublicKey(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to create user', details: message });
  }
}

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to fetch users', details: message });
  }
}


export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to fetch user', details: message });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { email, role, status } = req.body;

    // Validate input data
    const validation = validateUserUpdate({ email, role, status });
    if (!validation.isValid) {
      res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
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
        res.status(409).json({ error: 'Email already in use' });
        return;
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to update user', details: message });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: 'User deleted successfully'});
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to delete user', details: message });
  }
}

export async function exportUsers(req: Request, res: Response): Promise<void> {
  try {
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
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to export users', details: message });
  }
}

export async function getPublicKeyEndpoint(req: Request, res: Response): Promise<void> {
  try {
    const publicKey = getPublicKey();
    res.status(200).json({ publicKey });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to fetch public key', details: message });
  }
}
