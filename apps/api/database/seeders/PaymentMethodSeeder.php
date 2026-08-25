<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\PaymentMethod;

class PaymentMethodSeeder extends Seeder
{
    public function run(): void
    {
        $methods = [
            [
                'name' => 'Dinheiro',
                'description' => 'Pagamento realizado em espécie no momento da entrega ou retirada.'
            ],
            [
                'name' => 'Cartão de Débito',
                'description' => 'Pagamento à vista com cartão de débito.'
            ],
            [
                'name' => 'Cartão de Crédito',
                'description' => 'Pagamento com cartão de crédito, sujeito a parcelamento.'
            ],
            [
                'name' => 'PIX',
                'description' => 'Transferência instantânea utilizando a chave PIX.'
            ],
            [
                'name' => 'Boleto',
                'description' => 'Pagamento através de boleto bancário com data de vencimento.'
            ],
            [
                'name' => 'Carteira Digital',
                'description' => 'Pagamento utilizando saldo em carteiras digitais como PicPay, Mercado Pago, etc.'
            ],
            [
                'name' => 'Transferência Bancária',
                'description' => 'Transferência entre contas (TED ou DOC).'
            ],
        ];

        foreach ($methods as $method) {
            PaymentMethod::updateOrCreate(
                ['name' => $method['name']],
                [
                    'slug' => Str::slug($method['name']),
                    'description' => $method['description'],
                    'is_active' => true,
                ]
            );
        }
    }
}
