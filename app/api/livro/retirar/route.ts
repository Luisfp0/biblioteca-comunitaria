import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { livroId } = await request.json();

    if (!livroId) {
      return NextResponse.json(
        { error: "ID do livro não fornecido" },
        { status: 400 }
      );
    }

    // Atualizar status do livro para retirado
    const { data, error } = await supabase
      .from("livros")
      .update({ status: "retirado" })
      .eq("id", livroId)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar livro:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar status do livro" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, livro: data });
  } catch (error) {
    console.error("Erro na rota de retirada:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
