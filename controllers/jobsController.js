import jobsModel from "../models/jobsModel.js";
import mongoose from "mongoose";
import moment from "moment";

// Create Job Controller
export const createJobController = async (req, res, next) => {
    try {
        const { company, position } = req.body;

        // Validation
        if (!company || !position) {
            return next('Please provide all fields');
        }

        // Attach the user ID to the job data
        req.body.createdBy = req.user.userId;

        // Create the job in the database
        const job = await jobsModel.create(req.body);

        // Return a successful response
        res.status(201).json({ job });
    } catch (error) {
        next(error);
    }
};

// Get Jobs
export const getAllJobsController = async (req, res, next) => {
    const { status, workType, search, sort } = req.query;
    // Condition for Searching
    const queryObject = {
        createdBy: req.user.userId
    }
    // Logic filters (all for frontend)
    if (status && status !== 'all') {
        queryObject.status = status;
    }
    if (workType && workType !== 'all') {
        queryObject.workType = workType;
    }
    if (search) {
        queryObject.position = { $regex: search, $options: 'i' };
    }
    let queryResult = jobsModel.find(queryObject);

    // Sorting
    if (sort === 'latest') {
        queryResult = queryResult.sort('-createdAt');
    }
    if (sort === 'oldest') {
        queryResult = queryResult.sort('createdAt');
    }
    if (sort === 'a-z') {
        queryResult = queryResult.sort('position');
    }
    if (sort === 'z-a') {
        queryResult = queryResult.sort('-position');
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    queryResult = queryResult.skip(skip).limit(limit);

    // Jobs Count
    const totalJobs = await jobsModel.countDocuments(queryResult);
    const numOfPages = Math.ceil(totalJobs / limit);
    const jobs = await queryResult;



    // const jobs = await jobsModel.find({ createdBy: req.user.userId });
    res.status(200).json({
        totalJobs,
        jobs,
        numOfPages,
    });
}

export const updateJobController = async (req, res, next) => {
    const { id } = req.params;
    const { company, position } = req.body;

    // Validation
    if (!company || !position) {
        return next('Please provide all fields');
    }

    // Find Job
    const job = await jobsModel.findOne({ _id: id });

    // Validation
    if (!job) {
        return next(`Job not found with this id: ${id}`);
    }

    // Authorization Check
    if (req.user.userId !== job.createdBy.toString()) {
        return next('You are not authorized to update this job');
    }

    // Update Job
    const updatedJob = await jobsModel.findOneAndUpdate(
        { _id: id },
        req.body,
        { new: true, runValidators: true }
    );

    // Respond with updated job
    res.status(200).json({ updatedJob });
};

// DELETE JOB
export const deleteJobController = async (req, res, next) => {
    const { id } = req.params;

    // Find Job
    const job = await jobsModel.findOne({ _id: id });

    // Validation
    if (!job) {
        return next(`Job not found with this id: ${id}`);
    }

    // Authorization Check
    if (req.user.userId !== job.createdBy.toString()) {
        return next('You are not authorized to update this job');
    }

    // Delete Job
    await jobsModel.deleteOne()
    res.status(200).json({ message: 'Job deleted successfully' });
}

// JOB STATS AND FILTER
export const jobStatsController = async (req, res) => {
    const stats = await jobsModel.aggregate([
        // Search by User Jobs
        {
            $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    // Default Stats
    const defaultStats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0
    }

    // Monthly Yearly Stats
    let monthlyApplication = await jobsModel.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: {
                    $sum: 1
                }

            }
        }
    ]);
    monthlyApplication = monthlyApplication.map(item => {
        const { _id: { year, month }, count } = item;
        const date = moment().month(month - 1).year(year).format('MMM Y');
        return { date, count };
    }).reverse();


    res.status(200).json({ totalJobs: stats.length, defaultStats, monthlyApplication });
}