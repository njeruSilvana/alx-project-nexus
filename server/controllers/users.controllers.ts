//Handles: Get Mentors, Get Investors, Get User by ID
// ============================================================
import { Request, Response } from 'express';
import User from '../models/User.model';

// --------------- GET ALL MENTORS ---------------
export const getMentors = async (req: Request, res: Response) => {
  try {
    const mentors = await User.find({ role: 'mentor' }).select('-password');

    res.json(mentors.map(m => ({
      id: m._id.toString(),
      name: m.name,
      email: m.email,
      role: m.role,
      bio: m.bio,
      location: m.location,
      expertise: m.expertise,
    })));

  } catch (error: any) {
    console.error('GetMentors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- GET ALL INVESTORS ---------------
export const getInvestors = async (req: Request, res: Response) => {
  try {
    const investors = await User.find({ role: 'investor' }).select('-password');

    res.json(investors.map(i => ({
      id: i._id.toString(),
      name: i.name,
      email: i.email,
      role: i.role,
      bio: i.bio,
      location: i.location,
      expertise: i.expertise,
    })));

  } catch (error: any) {
    console.error('GetInvestors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- GET USER BY ID ---------------
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      bio: user.bio,
      location: user.location,
      expertise: user.expertise,
    });

  } catch (error: any) {
    console.error('GetUserById error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- UPDATE USER PROFILE (protected) ---------------
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { bio, location, expertise } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Only update fields that were provided
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (expertise !== undefined) user.expertise = expertise;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        location: user.location,
        expertise: user.expertise,
      },
    });

  } catch (error: any) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};