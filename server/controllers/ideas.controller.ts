//Handles: Create, Get All, Get One, Like, Fund ideas
// ============================================================
import { Request, Response } from 'express';
import Idea from '../models/Idea.model';
import User from '../models/User.model';

// --------------- GET ALL IDEAS ---------------
export const getAllIdeas = async (req: Request, res: Response) => {
  try {
    // Find all ideas, populate userId to get the user's name
    const ideas = await Idea.find()
      .populate('userId', 'name email role')   // replace userId with user info
      .sort({ createdAt: -1 });                 // newest first

    // Format the response
    const formattedIdeas = ideas.map(idea => ({
      id: idea._id.toString(),
      userId: (idea.userId as any)._id?.toString() || idea.userId?.toString(),
      title: idea.title,
      description: idea.description,
      category: idea.category,
      fundingGoal: idea.fundingGoal,
      currentFunding: idea.currentFunding,
      likes: idea.likes,
      userName: (idea.userId as any).name || 'Unknown',
      createdAt: idea.createdAt,
    }));

    res.json(formattedIdeas);

  } catch (error: any) {
    console.error('GetAllIdeas error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- GET SINGLE IDEA BY ID ---------------
export const getIdeaById = async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('userId', 'name email role');

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    res.json({
      id: idea._id.toString(),
      userId: (idea.userId as any)._id?.toString(),
      title: idea.title,
      description: idea.description,
      category: idea.category,
      fundingGoal: idea.fundingGoal,
      currentFunding: idea.currentFunding,
      likes: idea.likes,
      userName: (idea.userId as any).name,
      createdAt: idea.createdAt,
    });

  } catch (error: any) {
    console.error('GetIdeaById error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- CREATE IDEA (protected) ---------------
export const createIdea = async (req: Request, res: Response) => {
  try {
    const { title, description, category, fundingGoal } = req.body;

    // req.userId comes from auth middleware
    const idea = new Idea({
      userId: req.userId,
      title: title.trim(),
      description: description.trim(),
      category,
      fundingGoal: Number(fundingGoal),
    });

    await idea.save();

    // Get the creator's name to return
    const user = await User.findById(req.userId).select('name');

    res.status(201).json({
      success: true,
      message: 'Idea submitted successfully!',
      idea: {
        id: idea._id.toString(),
        userId: idea.userId.toString(),
        title: idea.title,
        description: idea.description,
        category: idea.category,
        fundingGoal: idea.fundingGoal,
        currentFunding: idea.currentFunding,
        likes: idea.likes,
        userName: user?.name,
        createdAt: idea.createdAt,
      },
    });

  } catch (error: any) {
    console.error('CreateIdea error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- LIKE IDEA (protected, toggle) ---------------
export const likeIdea = async (req: Request, res: Response) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    const userId = req.userId!;
    const alreadyLiked = idea.likedBy.includes(userId as any);

    if (alreadyLiked) {
      // Unlike: remove user from likedBy array, decrease count
      idea.likedBy = idea.likedBy.filter(id => id.toString() !== userId);
      idea.likes = Math.max(0, idea.likes - 1);
    } else {
      // Like: add user to likedBy array, increase count
      idea.likedBy.push(userId as any);
      idea.likes += 1;
    }

    await idea.save();

    res.json({
      success: true,
      likes: idea.likes,
      liked: !alreadyLiked,   // tells frontend whether it was liked or unliked
    });

  } catch (error: any) {
    console.error('LikeIdea error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- FUND IDEA (protected) ---------------
export const fundIdea = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;

    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ error: 'Idea not found' });
    }

    // Don't let funding exceed the goal
    const newFunding = idea.currentFunding + Number(amount);
    idea.currentFunding = Math.min(newFunding, idea.fundingGoal);

    await idea.save();

    res.json({
      success: true,
      message: 'Funding added successfully!',
      currentFunding: idea.currentFunding,
      fundingGoal: idea.fundingGoal,
    });

  } catch (error: any) {
    console.error('FundIdea error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// --------------- GET IDEAS BY USER (protected) ---------------
export const getIdeasByUser = async (req: Request, res: Response) => {
  try {
    const ideas = await Idea.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(ideas.map(idea => ({
      id: idea._id.toString(),
      title: idea.title,
      description: idea.description,
      category: idea.category,
      fundingGoal: idea.fundingGoal,
      currentFunding: idea.currentFunding,
      likes: idea.likes,
      createdAt: idea.createdAt,
    })));

  } catch (error: any) {
    console.error('GetIdeasByUser error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

