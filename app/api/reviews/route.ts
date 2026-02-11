import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Helper function to get the path to the reviews file
const getReviewsFilePath = () => {
    return path.join(process.cwd(), 'data', 'reviews.json');
};

// Helper function to read reviews
async function getReviews() {
    const filePath = getReviewsFilePath();
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        // If file doesn't exist or is empty, return empty array
        return [];
    }
}

// Helper function to write reviews
async function saveReviews(reviews: any[]) {
    const filePath = getReviewsFilePath();
    await fs.writeFile(filePath, JSON.stringify(reviews, null, 2), 'utf-8');
}

export async function GET() {
    try {
        const reviews = await getReviews();
        return NextResponse.json(reviews);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newReview = await request.json();

        // Basic validation
        if (!newReview.name || !newReview.comment || !newReview.rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const reviews = await getReviews();

        // Add new review
        reviews.push(newReview);

        // Save updated reviews
        await saveReviews(reviews);

        return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save review' }, { status: 500 });
    }
}
