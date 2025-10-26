"use client";

import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useState } from "react";

interface UploadFotoProps {
  onUploadComplete: (url: string) => void;
  urlAtual?: string;
}

export default function UploadFoto({
  onUploadComplete,
  urlAtual,
}: UploadFotoProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(urlAtual || "");

  async function uploadFoto(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("Você deve selecionar uma imagem para fazer upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload para o Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("capas-livros")
        .upload(filePath, file, {
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Pegar URL pública
      const {
        data: { publicUrl },
      } = supabase.storage.from("capas-livros").getPublicUrl(filePath);

      setPreview(publicUrl);
      onUploadComplete(publicUrl);
    } catch (error) {
      alert("Erro ao fazer upload da foto: " + (error as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Foto da Capa
      </label>

      {preview && (
        <div className="mb-4 relative w-32 h-48">
          <Image
            src={preview}
            alt="Preview da capa"
            fill
            className="object-cover rounded border border-gray-300"
          />
        </div>
      )}

      <div className="flex items-center gap-4">
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={uploadFoto}
            disabled={uploading}
            className="hidden"
          />
          <div
            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading
              ? "Fazendo upload..."
              : preview
                ? "Trocar foto"
                : "Escolher foto"}
          </div>
        </label>

        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview("");
              onUploadComplete("");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Remover
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Formatos aceitos: JPG, PNG, WebP (máx. 5MB)
      </p>
    </div>
  );
}
