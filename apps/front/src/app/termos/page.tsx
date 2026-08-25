import type { Metadata } from 'next';
import { formatDate, LAST_UPDATE_DATE } from '@/lib/dateUtils';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Termos de Uso | Temperinho',
    description: 'Leia os nossos Termos de Uso para entender as regras e diretrizes da plataforma Temperinho.',
};

export default function TermsPage() {
    const lastUpdated = formatDate(LAST_UPDATE_DATE, "d 'de' MMMM 'de' yyyy");

    return (
        <div className="min-h-screen bg-warm-50">
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12">
                    <h1 className="text-3xl lg:text-4xl font-display font-bold text-warm-900 mb-8">
                        Termos de Uso
                    </h1>

                    <article className="prose prose-warm max-w-none">
                        <p className="text-warm-600 text-lg mb-8">
                            Última atualização: {lastUpdated}
                        </p>

                        <p className="text-warm-700 leading-relaxed mb-8">
                            Bem-vindo(a) ao Temperinho! Estes Termos de Uso regem seu acesso e uso de nossa plataforma. Ao utilizá-la, você concorda com estas condições.
                        </p>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">1. Definições</h2>
                            <ul className="list-disc pl-6 text-warm-700 space-y-2">
                                <li><strong>&ldquo;Plataforma&rdquo;</strong> ou <strong>&ldquo;Serviço&rdquo;</strong>: Refere-se ao site, aplicativos e serviços oferecidos pelo Temperinho.</li>
                                <li><strong>&ldquo;Usuário&rdquo;</strong> ou <strong>&ldquo;Você&rdquo;</strong>: Toda pessoa física que acessa e/ou utiliza a Plataforma.</li>
                                <li><strong>&ldquo;Cliente&rdquo;</strong>: Pessoa física ou jurídica que contrata um dos Planos Pagos.</li>
                                <li><strong>&ldquo;Conteúdo de Usuário&rdquo;</strong>: Todas as receitas, textos, imagens, comentários e outros materiais que você submete, publica ou exibe na Plataforma.</li>
                                <li><strong>&ldquo;Conteúdo do Temperinho&rdquo;</strong>: Todo o conteúdo disponível na Plataforma, excluindo o Conteúdo de Usuário, como textos, design, logos, e a tecnologia subjacente.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">2. Aceitação e Vinculação à Política de Privacidade</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Ao acessar e usar a Plataforma, você declara que leu, entendeu e concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso Serviço.
                            </p>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                O uso da Plataforma também está sujeito à nossa{' '}
                                <Link href="/privacidade" className="text-rose-600 hover:text-rose-700 font-semibold">
                                    Política de Privacidade
                                </Link>
                                , que descreve como coletamos e tratamos seus dados pessoais e está incorporada a estes Termos por referência.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">3. Descrição do Serviço</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                O Temperinho é uma plataforma online que oferece receitas e conteúdo culinário, com foco em pessoas com restrições alimentares (dietas veganas, sem glúten, sem lactose, entre outras), servindo como um espaço de inspiração e troca de informações.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">4. Conta de Usuário</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Para acessar certas funcionalidades, você pode precisar criar uma conta. Você é o único responsável por:
                            </p>
                            <ul className="list-disc pl-6 text-warm-700 space-y-2">
                                <li>Fornecer informações verdadeiras, precisas e atualizadas.</li>
                                <li>Manter a confidencialidade de sua senha e credenciais de acesso.</li>
                                <li>Todas as atividades que ocorrem em sua conta.</li>
                                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado ou falha de segurança.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">5. Conteúdo do Usuário e Licença de Uso</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Ao submeter Conteúdo de Usuário na Plataforma, você declara e garante que:
                            </p>
                            <ul className="list-disc pl-6 text-warm-700 space-y-2 mb-4">
                                <li>Possui todos os direitos necessários sobre o conteúdo (autoria ou permissão).</li>
                                <li>O conteúdo não viola direitos de terceiros (como direitos autorais, de marca ou de imagem).</li>
                                <li>O conteúdo não é ofensivo, ilegal, difamatório, enganoso ou prejudicial.</li>
                            </ul>
                            <p className="text-warm-700 leading-relaxed">
                                Ao submeter Conteúdo de Usuário, você nos concede uma licença mundial, não exclusiva, isenta de royalties, sublicenciável e transferível para usar, reproduzir, distribuir, exibir, adaptar e modificar esse conteúdo em conexão com os serviços oferecidos pelo Temperinho e para as nossas atividades de promoção e marketing em quaisquer mídias.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">6. Regras de Conduta e Uso Proibido</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Você concorda em não usar a Plataforma para qualquer atividade ilegal ou para os seguintes fins:
                            </p>
                            <ul className="list-disc pl-6 text-warm-700 space-y-2">
                                <li>Publicar spam, conteúdo malicioso (vírus, malware) ou realizar ataques de negação de serviço.</li>
                                <li>Assediar, intimidar ou discriminar outros usuários.</li>
                                <li>Violar a propriedade intelectual de terceiros ou do Temperinho.</li>
                                <li>Tentar obter acesso não autorizado a sistemas ou contas de outros usuários.</li>
                                <li>Copiar, distribuir ou fazer engenharia reversa do Conteúdo do Temperinho ou de sua tecnologia sem autorização expressa.</li>
                            </ul>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">7. Moderação, Suspensão e Encerramento de Conta</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Reservamo-nos o direito, mas não a obrigação, de moderar, remover ou editar qualquer Conteúdo de Usuário que viole estes Termos. A violação destes Termos pode resultar, a nosso exclusivo critério, em advertência, suspensão temporária ou encerramento definitivo da sua conta.
                            </p>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Em caso de encerramento, seu direito de usar a Plataforma cessa imediatamente. O destino de seu Conteúdo e dados pessoais seguirá o disposto em nossa Política de Privacidade e na legislação aplicável.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">8. Propriedade Intelectual</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Excluindo o Conteúdo de Usuário, todo o Conteúdo do Temperinho é de nossa propriedade exclusiva ou de nossos licenciantes e é protegido por leis de direitos autorais, marcas e outras leis de propriedade intelectual.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">9. Isenção de Garantias, Avisos de Saúde e Limitação de Responsabilidade</h2>
                            <div className="border-l-4 border-rose-400 pl-4 py-2 mb-6 bg-rose-50">
                                <p className="font-semibold text-warm-800 leading-relaxed">
                                    AVISO DE SAÚDE IMPORTANTE: O conteúdo e as receitas fornecidas no Temperinho são para fins informacionais e de inspiração. Eles não substituem, em hipótese alguma, o aconselhamento médico, nutricional ou de saúde profissional. Consulte sempre um profissional de saúde qualificado para tratar de suas condições médicas e necessidades dietéticas específicas. Não nos responsabilizamos por quaisquer reações adversas, alérgicas ou outros problemas de saúde resultantes do preparo ou consumo das receitas aqui publicadas.
                                </p>
                            </div>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                A PLATAFORMA É FORNECIDA &ldquo;NO ESTADO EM QUE SE ENCONTRA&rdquo; E &ldquo;CONFORME DISPONÍVEL&rdquo;, SEM GARANTIAS DE QUALQUER TIPO, EXPRESSAS OU IMPLÍCITAS, INCLUINDO, MAS NÃO SE LIMITANDO A, GARANTIAS DE COMERCIABILIDADE, ADEQUAÇÃO A UM FIM ESPECÍFICO OU NÃO VIOLAÇÃO. NÃO GARANTIMOS QUE O SERVIÇO SERÁ ININTERRUPTO, SEGURO OU LIVRE DE ERROS.
                            </p>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Na máxima extensão permitida pela lei, em nenhuma circunstância o Temperinho, seus diretores ou funcionários serão responsáveis por danos indiretos, incidentais, especiais ou consequenciais resultantes do uso ou da incapacidade de usar a Plataforma. Para os Planos Pagos, nossa responsabilidade total está limitada ao valor pago pelo Cliente no mês em que o evento que deu origem à reclamação ocorreu.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">10. Planos Pagos: Contratação e Condições</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Oferecemos planos pagos (&ldquo;Planos&rdquo;) para Clientes que desejam destacar seus produtos e serviços. Ao contratar um Plano, você concorda com as seguintes condições.
                            </p>

                            <h3 className="text-xl font-semibold text-warm-800 mt-6 mb-3">a) Contratação e Pagamento</h3>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                A contratação dos Planos é realizada de forma manual, através do contato com nossa equipe de vendas. O pagamento é pré-pago e deve ser efetuado via PIX ou Cartão de Crédito, conforme as instruções fornecidas. A ativação dos serviços do Plano ocorrerá somente após a confirmação do pagamento.
                            </p>

                            <h3 className="text-xl font-semibold text-warm-800 mt-6 mb-3">b) Vigência e Renovação</h3>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Cada Plano tem vigência de 30 (trinta) dias a contar da data de confirmação do pagamento. <strong>A renovação não é automática.</strong> Ao final de cada período, nossa equipe entrará em contato para oferecer a renovação do pacote de serviços por um novo período.
                            </p>

                            <h3 className="text-xl font-semibold text-warm-800 mt-6 mb-3">c) Não Utilização dos Serviços Contratados</h3>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Os serviços incluídos em cada Plano (como artigos patrocinados, banners, etc.) são disponibilizados para o ciclo mensal vigente. Caso o Cliente não forneça os materiais ou informações necessárias para a execução de um serviço dentro do ciclo, <strong>o direito àquele serviço específico expirará ao final do período, sem possibilidade de acúmulo para meses futuros ou reembolso.</strong>
                            </p>

                            <h3 className="text-xl font-semibold text-warm-800 mt-6 mb-3">d) Rescisão Antecipada pelo Cliente</h3>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                O Cliente pode solicitar o encerramento do seu Plano a qualquer momento, enviando um e-mail para contato@temperinho.com.br. Neste caso, os serviços contratados permanecerão ativos até o final do ciclo mensal já pago. Não haverá reembolso, pró-rata ou crédito por períodos não utilizados.
                            </p>

                            <h3 className="text-xl font-semibold text-warm-800 mt-6 mb-3">e) Direito de Arrependimento</h3>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Para a <strong>primeira contratação</strong> de um Plano, o Cliente poderá exercer o direito de arrependimento no prazo de 7 (sete) dias corridos, a contar da data de confirmação do pagamento. A solicitação deve ser feita pelo e-mail contato@temperinho.com.br, e o valor integral pago será estornado. Após esse prazo, aplicam-se as regras de rescisão do item anterior.
                            </p>

                            <h3 className="text-xl font-semibold text-warm-800 mt-6 mb-3">f) Reajuste de Preços</h3>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Reservamo-nos o direito de reajustar os preços dos Planos. Qualquer alteração será comunicada aos Clientes com uma antecedência mínima de 30 (trinta) dias da data de vigência do novo valor.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">11. Modificações dos Termos</h2>
                            <p className="text-warm-700 leading-relaxed mb-4">
                                Reservamo-nos o direito de modificar estes Termos a qualquer momento. Notificaremos sobre alterações significativas através da plataforma ou por e-mail. A continuação do uso do Serviço após a notificação constituirá sua aceitação dos termos revisados.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">12. Legislação Aplicável e Foro</h2>
                            <p className="text-warm-700 leading-relaxed">
                                Estes Termos serão regidos e interpretados de acordo com as leis da República Federativa do Brasil. Para dirimir quaisquer litígios, fica eleito o foro da Comarca de Tubarão, Santa Catarina. Esta cláusula, no entanto, não impede que o Usuário ou Cliente, em uma relação de consumo, opte por ajuizar uma eventual ação no foro de seu próprio domicílio, conforme facultado pelo Código de Defesa do Consumidor.
                            </p>
                        </section>

                        <section className="mb-8">
                            <h2 className="text-2xl font-semibold text-warm-800 mb-4">13. Contato</h2>
                            <p className="text-warm-700 leading-relaxed">
                                Para dúvidas sobre estes Termos de Uso, entre em contato conosco através do e-mail: contato@temperinho.com.br.
                            </p>
                        </section>
                    </article>
                </div>
            </main>
        </div>
    );
}