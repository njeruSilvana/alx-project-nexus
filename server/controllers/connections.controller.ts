// Handles: Create, Get, Accept, Reject connections

import { Request, Response } from 'express';
import Connection from '../models/Connection.model';
import User from '../models/User.model';

// --------------- GET USER CONNECTIONS (protected) ---------------
export const getConnections = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    // Find connections where user is either sender OR receiver
    const connections = await Connection.find({
      $or: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
    })
    .populate('fromUserId', 'name email role')
    .populate('toUserId', 'name email role')
    .sort({ createdAt: -1 });

    res.json(connections.map(conn => ({
      id: conn._id.toString(),
      fromUserId: conn.fromUserId.toString(),
      toUserId: conn.toUserId.toString(),
      fromUserName: (conn.fromUserId as any).name,
      toUserName: (conn.toUserId as any).name,
      type: conn.type,
      status: conn.status,
      message: conn.message,
      createdAt: conn.createdAt,
    })));

  } catch (error: any) {
    console.error('GetConnections error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- CREATE CONNECTION (protected) ---------------
export const createConnection = async (req: Request, res: Response) => {
  try {
    const { toUserId, type, message } = req.body;
    const fromUserId = req.userId!;

    // 1. Don't allow self-connection
    if (fromUserId === toUserId) {
      return res.status(400).json({ error: 'You cannot connect with yourself' });
    }

    // 2. Check if the target user exists
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 3. Check for duplicate connection request
    const existingConnection = await Connection.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ error: 'Connection request already exists' });
    }

    // 4. Create the connection
    const connection = new Connection({
      fromUserId,
      toUserId,
      type,
      status: 'pending',
      message: message || '',
    });

    await connection.save();

    res.status(201).json({
      success: true,
      message: 'Connection request sent!',
      connection: {
        id: connection._id.toString(),
        type: connection.type,
        status: connection.status,
      },
    });

  } catch (error: any) {
    console.error('CreateConnection error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Connection already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- ACCEPT CONNECTION (protected) ---------------
export const acceptConnection = async (req: Request, res: Response) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    // Only the person who RECEIVED the request can accept it
    if (connection.toUserId.toString() !== req.userId) {
      return res.status(403).json({ error: 'You are not authorized to accept this request' });
    }

    connection.status = 'accepted';
    await connection.save();

    res.json({
      success: true,
      message: 'Connection accepted!',
      status: connection.status,
    });

  } catch (error: any) {
    console.error('AcceptConnection error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- REJECT CONNECTION (protected) ---------------
export const rejectConnection = async (req: Request, res: Response) => {
  try {
    const connection = await Connection.findById(req.params.id);

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    if (connection.toUserId.toString() !== req.userId) {
      return res.status(403).json({ error: 'You are not authorized to reject this request' });
    }

    connection.status = 'rejected';
    await connection.save();

    res.json({
      success: true,
      message: 'Connection rejected',
      status: connection.status,
    });

  } catch (error: any) {
    console.error('RejectConnection error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
