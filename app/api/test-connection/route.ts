import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabase";

// Configuración del cliente Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6dXB3eHZkZHloZXVlcWFubGZ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjk4OTEwMiwiZXhwIjoyMDUyNTY1MTAyfQ.7xuaifl0mLWb3TCkNBK_SnNIyDo3zt-jdp1-DVyS9b0';

const supabaseClient = createClient(supabaseUrl || '', supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// CREATE
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseClient
      .from('test_table')
      .insert([{ name: body.name }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error creating record:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// READ
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Connection successful",
      data
    });
  } catch (error) {
    console.error('[TEST_CONNECTION_ERROR]', error);
    return NextResponse.json({
      success: false,
      error: "Failed to connect to database"
    }, { status: 500 });
  }
}

// UPDATE
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabaseClient
      .from('test_table')
      .update({ name: body.name })
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error updating record:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'ID is required' 
      }, { status: 400 });
    }

    const { error } = await supabaseClient
      .from('test_table')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted record ${id}` 
    });
  } catch (error) {
    console.error('Error deleting record:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 