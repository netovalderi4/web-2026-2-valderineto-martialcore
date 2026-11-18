import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  User,
  Mail,
  Phone,
  Flame,
  FileText,
  CheckCircle2,
  AlertCircle,
  Database,
  Cloud,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODALITY_OPTIONS = [
  'Brazilian Jiu-Jitsu',
  'Muay Thai',
  'Karatê',
  'Judô',
  'Capoeira',
  'Boxe'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [modality, setModality] = useState('Brazilian Jiu-Jitsu');
  const [bio, setBio] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedS3Url, setUploadedS3Url] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inicializa o formulário com dados do usuário da sessão
  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '(84) 99876-5432');
      setModality(user.modality || 'Brazilian Jiu-Jitsu');
      setBio(user.bio || 'Atleta e Gestor no Tatame MartialCore');
      setPhotoPreview(user.picture || null);
      setPhotoBase64(null);
      setSuccessMessage(null);
      setErrorMessage(null);
      setUploadedS3Url(null);
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  // Trata upload de imagem local e converte para Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecione um arquivo de imagem válido (JPG ou PNG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('A imagem deve ter no máximo 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setPhotoBase64(result);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('O nome não pode ficar em branco.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const apiUrl =
      import.meta.env.VITE_PROFILE_API_URL ||
      'https://k8ux1lax2k.execute-api.us-east-1.amazonaws.com/prod/profile';

    try {
      const payload = {
        userId: user?.id || email || 'valderi@ufersa.edu.br',
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        modality,
        bio: bio.trim(),
        photoBase64: photoBase64 || undefined,
        photoUrl: !photoBase64 && photoPreview ? photoPreview : undefined
      };

      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || errorData.error || `Erro HTTP ${response.status}`);
      }

      const resData = await response.json();
      const savedPhotoUrl = resData.data?.photoUrl || photoPreview;

      setUploadedS3Url(savedPhotoUrl);
      setSuccessMessage('Perfil atualizado com sucesso no Amazon DynamoDB e S3!');

      // Atualiza o contexto global e localStorage da aplicação
      updateUserProfile({
        name: name.trim(),
        phone: phone.trim(),
        modality,
        bio: bio.trim(),
        picture: savedPhotoUrl
      });
    } catch (err: unknown) {
      console.error('Falha ao atualizar perfil no API Gateway:', err);
      const msg = err instanceof Error ? err.message : 'Falha na comunicação com o API Gateway.';
      setErrorMessage(`Não foi possível salvar o perfil: ${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-bold shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900 dark:text-white leading-tight">
                Perfil do Atleta / Usuário
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                  <Database className="w-3 h-3" /> DynamoDB: valderi-message-2026.2
                </span>
                <span className="text-zinc-400 dark:text-zinc-600">•</span>
                <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold">
                  <Cloud className="w-3 h-3" /> S3: valderi-profile-2026.2
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Seção da Foto de Perfil (S3) */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-zinc-300 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shadow-md">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Foto de Perfil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-zinc-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                title="Clique para escolher uma nova foto"
              >
                <Camera className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Trocar</span>
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Foto de Perfil do Tatame
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                Armazenada no Bucket <span className="font-mono text-zinc-700 dark:text-zinc-300 font-semibold">valderi-profile-2026.2</span>. Escolha uma foto do seu computador diferente da autenticação federada (Gmail).
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition cursor-pointer shadow-sm"
              >
                <Upload className="w-3.5 h-3.5" />
                Carregar Nova Foto
              </button>
            </div>
          </div>

          {/* Feedback de Alerta / Sucesso */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span>{successMessage}</span>
              </div>
              {uploadedS3Url && (
                <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 break-all pl-6">
                  S3 URL: {uploadedS3Url}
                </p>
              )}
            </div>
          )}

          {/* Campos do Formulário */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nome Completo */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-zinc-400" /> Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
              />
            </div>

            {/* E-mail (Identificador) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-zinc-400" /> E-mail (ID Cognito)
              </label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
                title="E-mail vinculado à autenticação"
              />
            </div>

            {/* Telefone / WhatsApp */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-zinc-400" /> Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="(84) 99999-9999"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition"
              />
            </div>

            {/* Modalidade Principal */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-zinc-400" /> Arte Marcial Principal
              </label>
              <select
                value={modality}
                onChange={e => setModality(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition cursor-pointer"
              >
                {MODALITY_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Bio / Graduação */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-zinc-400" /> Bio / Graduação no Tatame
            </label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={3}
              placeholder="Descreva sua faixa, tempo de treino e objetivos..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-xl transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-900 transition cursor-pointer shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando no S3 & DynamoDB...
                </>
              ) : (
                'Salvar Alterações no Perfil'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
