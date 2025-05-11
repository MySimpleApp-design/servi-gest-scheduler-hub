
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Home = () => {
  const features = [
    {
      title: "Para Prestadores de Serviço",
      description: "Gerencie seus serviços, agendamentos e clientes de forma eficiente.",
      items: [
        "Cadastre seus serviços com preços e duração",
        "Visualize todos os agendamentos em um só lugar",
        "Acompanhe seu faturamento mensal",
        "Analyze dados importantes através de gráficos"
      ]
    },
    {
      title: "Para Clientes",
      description: "Agende serviços com facilidade e acompanhe seus compromissos.",
      items: [
        "Encontre prestadores de serviço disponíveis",
        "Agende serviços com poucos cliques",
        "Visualize histórico de agendamentos",
        "Receba confirmações de agendamentos"
      ]
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      role: "Cabeleireira",
      content: "O ServiGest revolucionou o meu negócio! Consigo gerenciar meus horários e clientes de forma muito mais eficiente."
    },
    {
      name: "João Santos",
      role: "Cliente",
      content: "Nunca foi tão fácil encontrar e marcar serviços. A plataforma é intuitiva e prática!"
    },
    {
      name: "Ana Oliveira",
      role: "Massoterapeuta",
      content: "Os relatórios e gráficos me ajudam a entender melhor meu negócio e tomar decisões estratégicas."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Gestão de Serviços e Agendamentos
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-gray-600">
            Plataforma completa para prestadores de serviço e clientes gerenciarem agendamentos de forma simples e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="px-8">Começar Agora</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="px-8">Entrar</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <svg
                          className="h-6 w-6 mr-2 text-servigest-green flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-servigest-blue flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <CardTitle className="mt-4">Cadastre-se</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Crie sua conta como cliente ou prestador de serviços em poucos passos</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-servigest-blue flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <CardTitle className="mt-4">
                  {`${features[0].title === "Para Prestadores de Serviço" ? "Cadastre seus serviços" : "Escolha um serviço"}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {features[0].title === "Para Prestadores de Serviço"
                    ? "Adicione seus serviços, com preços, descrições e duração"
                    : "Navegue pelos prestadores e serviços disponíveis"}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-servigest-blue flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <CardTitle className="mt-4">
                  {features[0].title === "Para Prestadores de Serviço" ? "Gerencie seu negócio" : "Agende e acompanhe"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  {features[0].title === "Para Prestadores de Serviço"
                    ? "Visualize agendamentos, acompanhe métricas e atenda seus clientes"
                    : "Escolha data e hora e acompanhe o status dos seus agendamentos"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Depoimentos</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <svg 
                        className="w-10 h-10 text-servigest-blue opacity-20" 
                        fill="currentColor" 
                        viewBox="0 0 32 32"
                      >
                        <path d="M10 8v10H0V8h10zm2-2H0v14h12V6zm10 2v10H12V8h10zm2-2H12v14h12V6z"></path>
                      </svg>
                    </div>
                    <p className="flex-grow mb-4">{testimonial.content}</p>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-servigest-blue text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de prestadores de serviço e clientes que estão simplificando seu processo de agendamento.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="px-8">
              Criar Conta Gratuitamente
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
