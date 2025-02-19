"use server";


import prisma from "../../../prisma/prismaClient";
import { NextResponse } from "next/server";

interface TransactionParams {
    amount: number;
    type: "DEPOSIT" | "WITHDRAW";
    description: string;
}

export const createTransaction = async ({ amount, type, description }: TransactionParams) => {

    if(!amount || !type || !description) {
        return NextResponse.json({ message: "Please provide all required fields" }, { status: 400 });
    }

    if(type !== "DEPOSIT" && type !== "WITHDRAW") {
        return NextResponse.json({ message: "Invalid transaction type" }, { status: 400 });
    }

    if(amount <= 0){
        return NextResponse.json({ message: "Amount must be greater than 0" }, { status : 400});
    }

    if(description.trim().length === 0) {
        return NextResponse.json({ message: "Description cannot be empty" }, { status : 400});
    }

    

    try {
        const newTransaction = await prisma.transaction.create({
            data: {
                amount,
                type,
                description
            }
        })

        if(newTransaction) {
            return NextResponse.json({ message: "Transaction created successfully", transaction: newTransaction });
        }
        
    } catch (error) {
        console.log("Error creating transaction", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }finally{
        await prisma.$disconnect();
    }

}