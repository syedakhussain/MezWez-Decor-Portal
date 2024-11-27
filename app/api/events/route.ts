import { NextResponse } from 'next/server'
import clientPromise from '../../../lib/mongodb'

export async function GET() {
  const client = await clientPromise
  const db = client.db("mezwez")
  const events = await db.collection("events").find({}).toArray()
  return NextResponse.json(events)
}

export async function POST(request: Request) {
  const client = await clientPromise
  const db = client.db("mezwez")
  const event = await request.json()
  const result = await db.collection("events").insertOne(event)
  return NextResponse.json(result)
}

