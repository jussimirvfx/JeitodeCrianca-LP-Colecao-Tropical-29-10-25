
import React, { useState } from 'react';
import { FormData } from '../types';
import { 
  calculateLeadScore, 
  prepareLeadDataForMeta, 
  getPriorityLevel,
  validarTelefone, 
  validarEmail, 
  validarNome, 
  validarCNPJ 
} from '../leadScoringUtils';
import { useMetaPixel } from '@jussimirvfx/meta-pixel-tracking';
import { sendToWebhook, prepareWebhookPayload } from '../webhookUtils';

const InputField: React.FC<{ 
  id: string; 
  name: string; 
  type: string; 
  placeholder: string; 
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}> = (props) => (
    <div>
        <label htmlFor={props.id} className="block text-sm font-medium text-gray-200 mb-1">{props.placeholder}</label>
        <input 
          {...props} 
          className={`w-full px-4 py-2 bg-transparent border rounded-md text-white placeholder-gray-300 focus:ring-white focus:border-white ${
            props.error ? 'border-red-500' : 'border-white/40'
          }`} 
        />
        {props.error && <p className="text-red-400 text-sm mt-1">{props.error}</p>}
    </div>
);

const SelectField: React.FC<{ 
  id: string; 
  name: string; 
  placeholder: string; 
  options: string[]; 
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
}> = ({ id, name, placeholder, options, required, value, onChange, error }) => (
     <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-200 mb-1">{placeholder}</label>
        <select 
            id={id} 
            name={name} 
            required={required}
            value={value}
            onChange={onChange}
            className={`w-full px-4 py-2 bg-transparent border rounded-md text-white focus:ring-white focus:border-white ${
              error ? 'border-red-500' : 'border-white/40'
            }`}
        >
            <option className="text-black" value="" disabled>{placeholder}</option>
            {options.map(option => <option className="text-black" key={option} value={option}>{option}</option>)}
        </select>
        {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
);

const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const storeTypeOptions = [
    "Loja Infantil/Juvenil",
    "Loja Multimarcas", 
    "Atacado/Magazine",
    "Loja online/E-commerce",
    "Sacoleira"
];

const cnpjTimeOptions = [
    "3 anos ou mais",
    "1 a 2 anos",
    "Menos de um ano"
];

const ContactForm: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errors, setErrors] = useState<Partial<FormData>>({});
    
    // 🔑 PASSO 1: Importar os hooks do Meta Pixel
    const { trackLead, trackLeadQualificado } = useMetaPixel();
    
    // Estado do formulário com os nomes corretos para Meta Pixel
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        email: '',
        telefone: '',
        cidade: '',
        estado: '',
        cep: '',
        pais: 'Brasil',
        nomeLoja: '',
        cnpj: '',
        tipoLoja: '',
        tempoCnpj: '',
        possuiLojaFisica: '',
        possuiInscricaoEstadual: '',
        instagramLoja: ''
    });

    const bgImageUrl = '/images/contact-form-bg.webp';

    // Função para verificar qualificação do lead
    const verificarQualificacao = (formData: FormData, leadScore: number): boolean => {
        // 1. Verificar se tem score mínimo
        if (leadScore < 50) return false;
        
        // 2. Verificar se é pessoa jurídica (CNPJ presente)
        if (!formData.cnpj || formData.cnpj.length < 14) return false;
        
        // 3. Verificar se tem tempo de CNPJ adequado (3+ anos)
        if (formData.tempoCnpj !== '3 anos ou mais') return false;
        
        // 4. Verificar se possui loja física
        if (formData.possuiLojaFisica !== 'sim') return false;
        
        // 5. Verificar tipo de loja (priorizar Infantil/Juvenil e Multimarcas)
        const tiposQualificados = ['Loja Infantil/Juvenil', 'Loja Multimarcas'];
        if (!tiposQualificados.includes(formData.tipoLoja)) return false;
        
        return true;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpar erro do campo quando usuário começa a digitar
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        // Validar campos obrigatórios
        if (!formData.nome) {
            newErrors.nome = 'Nome é obrigatório';
        }

        if (!formData.email) {
            newErrors.email = 'Email é obrigatório';
        } else if (!validarEmail(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.telefone) {
            newErrors.telefone = 'Telefone é obrigatório';
        } else if (!validarTelefone(formData.telefone)) {
            newErrors.telefone = 'Telefone deve ter 10 ou 11 dígitos';
        }

        if (!formData.nomeLoja) {
            newErrors.nomeLoja = 'Nome da loja é obrigatório';
        }

        if (!formData.cnpj) {
            newErrors.cnpj = 'CNPJ é obrigatório';
        } else if (!validarCNPJ(formData.cnpj)) {
            newErrors.cnpj = 'CNPJ deve ter 14 dígitos';
        }

        if (!formData.cidade) {
            newErrors.cidade = 'Cidade é obrigatória';
        }

        if (!formData.estado) {
            newErrors.estado = 'Estado é obrigatório';
        }

        if (!formData.tipoLoja) {
            newErrors.tipoLoja = 'Tipo de loja é obrigatório';
        }

        if (!formData.tempoCnpj) {
            newErrors.tempoCnpj = 'Tempo de CNPJ é obrigatório';
        }

        if (!formData.possuiLojaFisica) {
            newErrors.possuiLojaFisica = 'Informe se possui loja física';
        }

        if (!formData.possuiInscricaoEstadual) {
            newErrors.possuiInscricaoEstadual = 'Informe se possui inscrição estadual';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        // 🔑 PASSO 2: Validações (do Prompt 1)
        if (!validateForm()) {
            return;
        }
        
        setStatus('loading');

        try {
            // 🔑 PASSO 3: Calcular lead score (do Prompt 1)
            const leadScore = calculateLeadScore(formData);
            
            // 🔑 PASSO 4: Preparar dados no formato correto
            const leadData = {
                name: formData.nome,
                email: formData.email,
                phone: formData.telefone,
                city: formData.cidade,
                state: formData.estado,
                zip: formData.cep,
                country: formData.pais,
                value: leadScore >= 70 ? 100 : 25,
                currency: 'BRL',
                content_name: 'Formulário de Contato',
                content_category: 'Lead Generation',
                lead_score: leadScore,
                store_name: formData.nomeLoja,
                cnpj: formData.cnpj,
                store_type: formData.tipoLoja,
                cnpj_time: formData.tempoCnpj,
                has_physical_store: formData.possuiLojaFisica,
                has_state_registration: formData.possuiInscricaoEstadual,
                instagram_store: formData.instagramLoja
            };

            // 🔑 PASSO 5: SEMPRE ENVIAR LEAD + VERIFICAR SE É QUALIFICADO
            // ✅ LEAD sempre dispara (qualquer score)
            await trackLead(leadData);
            console.log('✅ Lead enviado para Meta!');
            
            // ✅ LEAD QUALIFICADO dispara apenas se for qualificado
            const isLeadQualificado = verificarQualificacao(formData, leadScore);
            if (isLeadQualificado) {
                console.log(`📊 Lead qualificado detectado (score: ${leadScore}, tipo: ${formData.tipoLoja})`);
                await trackLeadQualificado(leadData);
                console.log('✅ Lead qualificado enviado para Meta!');
            } else {
                console.log(`📊 Lead básico (score: ${leadScore}, não qualificado)`);
            }
            
            // 🔑 PASSO 6: ENVIAR PARA WEBHOOK
            const webhookPayload = prepareWebhookPayload(formData, leadData, leadScore, isLeadQualificado);
            const webhookSuccess = await sendToWebhook(webhookPayload);
            
            if (webhookSuccess) {
                console.log('✅ Dados enviados para webhook com sucesso');
            } else {
                console.warn('⚠️ Falha ao enviar para webhook, mas lead foi processado');
            }
            
            // 4. Aqui você integrará com o Meta Tracking (PROMPT 2)
            console.log('Dados preparados para Meta:', leadData);
            console.log('Lead Score:', leadScore);
            console.log('Nível de Prioridade:', getPriorityLevel(leadScore));
            console.log('Payload do Webhook:', webhookPayload);
            
            // 5. Sua lógica de negócio (salvar no banco, etc)
            // await salvarLead(leadData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mostrar tela de sucesso
            setStatus('success');
        } catch (error) {
            console.error('Erro ao processar formulário:', error);
            setStatus('error');
        }
    };

    if (status === 'success') {
      return (
        <section 
          id="contact-form" 
          className="relative py-16 md:py-24 bg-cover bg-center"
          style={{backgroundImage: `url('${bgImageUrl}')`}}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="container mx-auto px-6 text-center relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">OBRIGADO!</h2>
              <p className="text-gray-200 text-lg">Seu cadastro foi enviado com sucesso. Em breve, nossa equipe comercial entrará em contato.</p>
          </div>
        </section>
      );
    }

    return (
        <section 
            id="contact-form" 
            className="relative py-16 md:py-24 bg-cover bg-center"
            style={{backgroundImage: `url('${bgImageUrl}')`}}
        >
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl mx-auto text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 uppercase">Fale Conosco</h2>
                    <p className="text-gray-300">
                        Preencha o formulário abaixo para receber o catálogo da nova coleção e dar o primeiro passo para se tornar um parceiro de sucesso.
                    </p>
                </div>
                <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-lg shadow-xl border border-white/20">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                           <InputField 
                             id="nome" 
                             name="nome" 
                             type="text" 
                             placeholder="Nome do Proprietário(a)" 
                             required 
                             value={formData.nome}
                             onChange={handleInputChange}
                             error={errors.nome}
                           />
                        </div>
                        <div className="md:col-span-2">
                           <InputField 
                             id="nomeLoja" 
                             name="nomeLoja" 
                             type="text" 
                             placeholder="Nome da Loja" 
                             required 
                             value={formData.nomeLoja}
                             onChange={handleInputChange}
                             error={errors.nomeLoja}
                           />
                        </div>
                        <InputField 
                          id="telefone" 
                          name="telefone" 
                          type="tel" 
                          placeholder="WhatsApp com DDD" 
                          required 
                          value={formData.telefone}
                          onChange={handleInputChange}
                          error={errors.telefone}
                        />
                        <InputField 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="Seu melhor E-mail" 
                          required 
                          value={formData.email}
                          onChange={handleInputChange}
                          error={errors.email}
                        />
                        <div className="md:col-span-2">
                           <InputField 
                             id="cnpj" 
                             name="cnpj" 
                             type="text" 
                             placeholder="CNPJ" 
                             required 
                             value={formData.cnpj}
                             onChange={handleInputChange}
                             error={errors.cnpj}
                           />
                        </div>
                        <InputField 
                          id="cidade" 
                          name="cidade" 
                          type="text" 
                          placeholder="Cidade" 
                          required 
                          value={formData.cidade}
                          onChange={handleInputChange}
                          error={errors.cidade}
                        />
                        <SelectField 
                          id="estado" 
                          name="estado" 
                          placeholder="Estado" 
                          options={brazilianStates} 
                          required 
                          value={formData.estado}
                          onChange={handleInputChange}
                          error={errors.estado}
                        />
                        
                        <div className="md:col-span-2">
                            <SelectField 
                              id="tipoLoja" 
                              name="tipoLoja" 
                              placeholder="Selecione o tipo de loja" 
                              options={storeTypeOptions} 
                              required 
                              value={formData.tipoLoja}
                              onChange={handleInputChange}
                              error={errors.tipoLoja}
                            />
                        </div>

                        <div className="md:col-span-2">
                            <SelectField 
                              id="tempoCnpj" 
                              name="tempoCnpj" 
                              placeholder="Selecione o tempo de CNPJ" 
                              options={cnpjTimeOptions} 
                              required 
                              value={formData.tempoCnpj}
                              onChange={handleInputChange}
                              error={errors.tempoCnpj}
                            />
                        </div>

                        <div className="md:col-span-1">
                            <fieldset>
                                <legend className="text-sm font-medium text-gray-200 mb-2">Possui loja física?</legend>
                                <div className="flex items-center gap-x-4">
                                    <div className="flex items-center">
                                        <input 
                                          id="hasPhysicalStoreYes" 
                                          name="possuiLojaFisica" 
                                          type="radio" 
                                          value="sim" 
                                          checked={formData.possuiLojaFisica === 'sim'}
                                          onChange={handleInputChange}
                                          className="h-4 w-4 text-white bg-transparent border-white/60 focus:ring-white" 
                                        />
                                        <label htmlFor="hasPhysicalStoreYes" className="ml-2 block text-sm text-gray-200">Sim</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                          id="hasPhysicalStoreNo" 
                                          name="possuiLojaFisica" 
                                          type="radio" 
                                          value="nao" 
                                          checked={formData.possuiLojaFisica === 'nao'}
                                          onChange={handleInputChange}
                                          className="h-4 w-4 text-white bg-transparent border-white/60 focus:ring-white" 
                                        />
                                        <label htmlFor="hasPhysicalStoreNo" className="ml-2 block text-sm text-gray-200">Não</label>
                                    </div>
                                </div>
                                {errors.possuiLojaFisica && <p className="text-red-400 text-sm mt-1">{errors.possuiLojaFisica}</p>}
                            </fieldset>
                        </div>

                        <div className="md:col-span-1">
                            <fieldset>
                                <legend className="text-sm font-medium text-gray-200 mb-2">Possui Inscrição Estadual?</legend>
                                <div className="flex items-center gap-x-4">
                                    <div className="flex items-center">
                                        <input 
                                          id="hasStateRegistrationYes" 
                                          name="possuiInscricaoEstadual" 
                                          type="radio" 
                                          value="sim" 
                                          checked={formData.possuiInscricaoEstadual === 'sim'}
                                          onChange={handleInputChange}
                                          className="h-4 w-4 text-white bg-transparent border-white/60 focus:ring-white" 
                                        />
                                        <label htmlFor="hasStateRegistrationYes" className="ml-2 block text-sm text-gray-200">Sim</label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                          id="hasStateRegistrationNo" 
                                          name="possuiInscricaoEstadual" 
                                          type="radio" 
                                          value="nao" 
                                          checked={formData.possuiInscricaoEstadual === 'nao'}
                                          onChange={handleInputChange}
                                          className="h-4 w-4 text-white bg-transparent border-white/60 focus:ring-white" 
                                        />
                                        <label htmlFor="hasStateRegistrationNo" className="ml-2 block text-sm text-gray-200">Não</label>
                                    </div>
                                </div>
                                {errors.possuiInscricaoEstadual && <p className="text-red-400 text-sm mt-1">{errors.possuiInscricaoEstadual}</p>}
                            </fieldset>
                        </div>
                        
                        <div className="md:col-span-2 text-center mt-4">
                           <button 
                                type="submit" 
                                disabled={status === 'loading'}
                                className="w-full bg-brand-blue hover:bg-blue-800 text-white font-bold py-3 px-12 rounded-lg text-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {status === 'loading' ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </>
                                ) : 'ENVIAR CADASTRO'}
                           </button>
                        </div>
                         {status === 'error' && <p className="text-red-400 md:col-span-2 text-center">Ocorreu um erro. Tente novamente.</p>}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
