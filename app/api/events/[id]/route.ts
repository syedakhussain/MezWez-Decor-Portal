import { NextResponse } from 'next/server'
import clientPromise from '../../../../lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db("mezwez")
  const event = await db.collection("events").findOne({ _id: new ObjectId(params.id) })
  return NextResponse.json(event)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db("mezwez")
  const event = await request.json()
  const result = await db.collection("events").updateOne(
    { _id: new ObjectId(params.id) },
    { $set: event }
  )
  return NextResponse.json(result)
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const client = await clientPromise
  const db = client.db("mezwez")
  const result = await db.collection("events").deleteOne({ _id: new ObjectId(params.id) })
  return NextResponse.json(result)
}

