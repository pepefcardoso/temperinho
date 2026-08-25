'use client';

import * as React from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Image as ImageType } from '@/types/image';

interface ImageProps {
    initialImage?: ImageType | null;
    onFileChange: (file: File | null) => void;
}

export function RecipeFormImage({ initialImage, onFileChange }: ImageProps) {
    const [imagePreview, setImagePreview] = React.useState<string | null>(initialImage?.url || null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const uploadAreaRef = React.useRef<HTMLLabelElement>(null);

    React.useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith('blob:')) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onFileChange(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        onFileChange(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        uploadAreaRef.current?.focus();
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Imagem de Capa</CardTitle>
                {imagePreview && (
                    <Button variant="ghost" size="sm" onClick={handleRemoveImage}>
                        <X className="h-4 w-4 mr-2" />
                        Remover
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <Label
                    htmlFor="image-upload"
                    className="cursor-pointer group focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
                    ref={uploadAreaRef}
                    tabIndex={0}
                >
                    <div className="relative border-2 border-dashed border-border rounded-lg p-4 text-center text-muted-foreground transition-colors group-hover:border-primary group-hover:bg-muted/50">
                        {imagePreview ? (
                            <div className="relative w-full aspect-video mx-auto">
                                <Image
                                    src={imagePreview}
                                    alt="Pré-visualização da imagem de capa"
                                    fill
                                    className="object-cover rounded-md"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 h-48">
                                <Upload className="h-10 w-10" />
                                <p className="font-semibold">Clique para fazer upload</p>
                                <p className="text-xs">Recomendado: 1280x720px</p>
                            </div>
                        )}
                    </div>
                </Label>
                <Input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    className="sr-only"
                    onChange={handleImageChange}
                    ref={fileInputRef}
                />
            </CardContent>
        </Card>
    );
}