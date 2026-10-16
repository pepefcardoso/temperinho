'use client';

import { useState } from 'react';
import { Flag, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { createReport, ReportableType, ReportReason } from '@/lib/api/report.server';

const reasonOptions: { value: ReportReason; label: string }[] = [
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate', label: 'Conteúdo impróprio' },
    { value: 'misinformation', label: 'Informação incorreta' },
    { value: 'other', label: 'Outro' },
];

interface ReportDialogProps {
    type: ReportableType;
    id: number;
    triggerLabel?: string;
    triggerVariant?: 'ghost' | 'outline';
    iconOnly?: boolean;
}

export function ReportDialog({ type, id, triggerLabel, triggerVariant = 'ghost', iconOnly = false }: ReportDialogProps) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<ReportReason | ''>('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleTriggerClick = () => {
        if (!user) {
            toast.error('Você precisa estar logado para denunciar.');
            return;
        }
        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!reason) {
            toast.error('Selecione um motivo.');
            return;
        }
        setIsSubmitting(true);
        try {
            await createReport(type, id, reason, comment || undefined);
            toast.success('Denúncia enviada. Nossa equipe vai analisar.');
            setOpen(false);
            setReason('');
            setComment('');
        } catch (error) {
            console.error('Erro ao enviar denúncia:', error);
            toast.error('Não foi possível enviar a denúncia. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Button variant={triggerVariant} size={iconOnly ? 'icon' : 'sm'} onClick={handleTriggerClick}>
                <Flag className="h-4 w-4" />
                {!iconOnly && <span className="ml-1">{triggerLabel ?? 'Denunciar'}</span>}
            </Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Denunciar conteúdo</AlertDialogTitle>
                        <AlertDialogDescription>
                            Conte o que há de errado. Nossa equipe vai revisar antes de tomar qualquer ação.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                        <Select value={reason} onValueChange={(v) => setReason(v as ReportReason)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o motivo" />
                            </SelectTrigger>
                            <SelectContent>
                                {reasonOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Detalhes adicionais (opcional)"
                            rows={3}
                        />
                    </div>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Enviar denúncia
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
