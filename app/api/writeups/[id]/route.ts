import { NextResponse } from 'next/server'
import { getWriteupData } from '@/lib/writeups'
import { remark } from 'remark'
import html from 'remark-html'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const writeupData = getWriteupData(params.id)
    const processedContent = await remark()
      .use(html)
      .process(writeupData.content)
    const contentHtml = processedContent.toString()

    return NextResponse.json({
      ...writeupData,
      content: contentHtml,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Writeup not found' },
      { status: 404 }
    )
  }
}
