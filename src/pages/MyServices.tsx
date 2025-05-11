
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const MyServices = () => {
  const { currentUser } = useAuth();
  const { services, getServicesByProvider, addService, updateService, deleteService } = useData();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    nome_servico: '',
    descricao: '',
    preco: '',
    duracao: ''
  });

  // Check if user is authorized to access this page
  React.useEffect(() => {
    if (currentUser?.tipo !== 'Prestador') {
      navigate('/dashboard');
      toast({
        title: "Acesso restrito",
        description: "Apenas prestadores de serviço podem acessar esta página.",
        variant: "destructive",
      });
    }
  }, [currentUser, navigate, toast]);

  if (!currentUser || currentUser.tipo !== 'Prestador') return null;

  const providerServices = getServicesByProvider(currentUser.id);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      nome_servico: '',
      descricao: '',
      preco: '',
      duracao: ''
    });
  };

  const handleAddService = () => {
    // Validate form
    if (!formData.nome_servico || !formData.preco || !formData.duracao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      addService({
        nome_servico: formData.nome_servico,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        duracao: parseInt(formData.duracao)
      });

      toast({
        title: "Serviço adicionado",
        description: "O serviço foi adicionado com sucesso.",
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro ao adicionar",
        description: "Ocorreu um erro ao adicionar o serviço.",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (service: any) => {
    setSelectedService(service);
    setFormData({
      nome_servico: service.nome_servico,
      descricao: service.descricao,
      preco: service.preco.toString(),
      duracao: service.duracao.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateService = () => {
    if (!selectedService) return;

    // Validate form
    if (!formData.nome_servico || !formData.preco || !formData.duracao) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      updateService({
        ...selectedService,
        nome_servico: formData.nome_servico,
        descricao: formData.descricao,
        preco: parseFloat(formData.preco),
        duracao: parseInt(formData.duracao)
      });

      toast({
        title: "Serviço atualizado",
        description: "O serviço foi atualizado com sucesso.",
      });
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao atualizar o serviço.",
        variant: "destructive",
      });
    }
  };

  const openDeleteDialog = (service: any) => {
    setSelectedService(service);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteService = () => {
    if (!selectedService) return;

    try {
      deleteService(selectedService.id);
      toast({
        title: "Serviço removido",
        description: "O serviço foi removido com sucesso.",
      });
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro ao remover",
        description: "Ocorreu um erro ao remover o serviço.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="pb-6">
        <h1 className="text-3xl font-bold">Meus Serviços</h1>
        <p className="text-gray-500">Gerencie os serviços que você oferece</p>
      </div>

      <div className="mb-6">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">Adicionar Novo Serviço</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Serviço</DialogTitle>
              <DialogDescription>
                Preencha os detalhes do novo serviço que você oferece
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome_servico">Nome do serviço *</Label>
                <Input
                  id="nome_servico"
                  name="nome_servico"
                  placeholder="Ex: Corte de Cabelo"
                  value={formData.nome_servico}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  name="descricao"
                  placeholder="Descreva os detalhes do serviço"
                  value={formData.descricao}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="preco">Preço (R$) *</Label>
                  <Input
                    id="preco"
                    name="preco"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.preco}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duracao">Duração (min) *</Label>
                  <Input
                    id="duracao"
                    name="duracao"
                    type="number"
                    min="5"
                    placeholder="30"
                    value={formData.duracao}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleAddService}>Adicionar Serviço</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
            <DialogDescription>
              Atualize os detalhes do serviço
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit_nome_servico">Nome do serviço *</Label>
              <Input
                id="edit_nome_servico"
                name="nome_servico"
                value={formData.nome_servico}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit_descricao">Descrição</Label>
              <Textarea
                id="edit_descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_preco">Preço (R$) *</Label>
                <Input
                  id="edit_preco"
                  name="preco"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.preco}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_duracao">Duração (min) *</Label>
                <Input
                  id="edit_duracao"
                  name="duracao"
                  type="number"
                  min="5"
                  value={formData.duracao}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateService}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Você tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDeleteService}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Services List */}
      {providerServices.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-gray-500 mb-4">Você ainda não possui serviços cadastrados</p>
            <Button onClick={() => setIsAddDialogOpen(true)}>Adicionar Primeiro Serviço</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providerServices.map(service => (
            <Card key={service.id} className="h-full">
              <CardHeader>
                <CardTitle>{service.nome_servico}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-gray-500">{service.descricao || 'Sem descrição'}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium">Preço:</span>
                    <p>R$ {service.preco.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duração:</span>
                    <p>{service.duracao} minutos</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(service)}>
                  Editar
                </Button>
                <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(service)}>
                  Excluir
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default MyServices;
