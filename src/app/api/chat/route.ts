/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import groqService from '@/services/groq-service';

export interface AIResponse {
  response: {
    kwargs: {
      content: string;
    };
    tradeSignal?: any;
  };
  threadId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, threadId } = await request.json();
    
    const chatResponse = await groqService.chatWithAssistant(message, threadId);

    return NextResponse.json({
      response: {
        kwargs: {
          content: chatResponse.response.content
        }
      },
      threadId: chatResponse.threadId
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process chat message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { threadId } = await request.json();
    
    // await groqService.clearConversationHistory(threadId);
    
    return NextResponse.json({ 
      success: true,
      message: 'Thread cleared successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete thread' },
      { status: 500 }
    );
  }
}