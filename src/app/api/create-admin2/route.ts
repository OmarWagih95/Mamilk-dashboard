import { NextResponse } from "next/server";
import { ConnectDB } from "@/config/db";
import UserModel from "@/app/models/userModel";

export async function GET() {
  try {
    // Connect to the database
    await ConnectDB();
    
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ username: 'admin2' });
    if (existingUser) {
      return NextResponse.json({ message: "User 'admin2' already exists!" });
    }

    // Create the new user
    const newUser = new UserModel({
      username: 'admin2',
      password: 'admin234'
    });

    // Save to database
    await newUser.save();

    return NextResponse.json({ message: "User 'admin2' created successfully with password 'admin234'!" }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
