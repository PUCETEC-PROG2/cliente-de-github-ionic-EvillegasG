import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTextarea, 
  IonTitle, 
  IonToolbar,
  IonInput, 
  IonButton,
  IonAlert,
  IonSpinner,
  IonNote,
  IonToast,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import { useState } from 'react';
import { informationCircle, lockClosed, globe } from 'ionicons/icons';
import './Tab2.css';
import { createRepository, CreateRepositoryRequest } from '../services/githubService';
import { GITHUB_TOKEN, GITHUB_USERNAME } from '../config/env';
import { useHistory } from 'react-router-dom';

const Tab2: React.FC = () => {
  const history = useHistory();
  
  // Form states
  const [repoName, setRepoName] = useState<string>('');
  const [repoDescription, setRepoDescription] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  // Validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  // API states
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showErrorAlert, setShowErrorAlert] = useState<boolean>(false);

  // Check if token is configured
  const isTokenConfigured = GITHUB_TOKEN;

  // Form validation
  const validateForm = (): boolean => {
    if (!isTokenConfigured) {
      setValidationError('Token de GitHub no configurado. Verifica src/config/githubConfig.ts');
      return false;
    }

    if (!repoName.trim()) {
      setValidationError('El nombre del repositorio es obligatorio');
      return false;
    }

    if (repoName.length > 39) {
      setValidationError('El nombre no puede exceder 39 caracteres');
      return false;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(repoName)) {
      setValidationError('El nombre solo puede contener letras, números, puntos, guiones y guiones bajos');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleCreateRepository = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setValidationError(null);
    setError(null);

    try {
      const repoData: CreateRepositoryRequest = {
        name: repoName.trim(),
        description: repoDescription.trim() || undefined,
        private: isPrivate,
        auto_init: true,
      };

      await createRepository(repoData, GITHUB_TOKEN);

      // Success feedback
      setSuccessMessage(`✓ Repositorio "${repoName}" creado exitosamente`);
      setSuccess(true);

      // Clear form
      setRepoName('');
      setRepoDescription('');
      setIsPrivate(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al crear el repositorio';
      setError(errorMessage);
      setShowErrorAlert(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Crear Repositorio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">✨ Crear Nuevo Repositorio</IonTitle>
          </IonToolbar>
        </IonHeader>

        {!isTokenConfigured && (
          <div className="config-alert-container">
            <IonCard color="warning">
              <IonCardContent>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                  <IonIcon icon={informationCircle} style={{ fontSize: '1.5rem' }}></IonIcon>
                  <strong>Configura tu Token de GitHub</strong>
                </div>
                <p style={{ marginBottom: '15px' }}>Para crear repositorios, necesitas un token personal:</p>
                <ol style={{ paddingLeft: '20px' }}>
                  <li>Abre <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" style={{ color: '#0064d4', fontWeight: 'bold' }}>github.com/settings/tokens</a></li>
                  <li>Click en "Generate new token (classic)"</li>
                  <li>Selecciona scope: <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>repo</code> (para repositorios privados)</li>
                  <li>Copia el token generado</li>
                  <li>Crea un archivo <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px' }}>.env</code> en la raíz del proyecto</li>
                  <li>Pega: <code style={{ background: '#f0f0f0', padding: '2px 6px', borderRadius: '3px', display: 'block', margin: '5px 0' }}>VITE_GITHUB_TOKEN=tu_token_aqui</code></li>
                </ol>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        {isTokenConfigured && (
          <div className="form-container">
            <div className="form-section">
              <div style={{ marginBottom: '20px', padding: '15px', background: '#e8f5e9', borderRadius: '8px', borderLeft: '4px solid #4caf50' }}>
                <p style={{ margin: '0', color: '#2e7d32', fontSize: '0.95rem' }}>
                  ✓ Token configurado correctamente
                </p>
              </div>

              {validationError && (
                <div className="validation-error-container">
                  <IonNote color="warning">{validationError}</IonNote>
                </div>
              )}

              <div className="form-field">
                <IonInput
                  label="📁 Nombre del Repositorio"
                  labelPlacement="stacked"
                  placeholder="ej: mi-awesome-proyecto"
                  value={repoName}
                  onIonChange={(e) => setRepoName(String(e.detail.value))}
                  disabled={loading}
                  clearInput
                  helperText={`${repoName.length}/39 caracteres`}
                />
              </div>

              <div className="form-field">
                <IonTextarea
                  label="📝 Descripción (Opcional)"
                  labelPlacement="stacked"
                  placeholder="Describe brevemente tu proyecto..."
                  value={repoDescription}
                  onIonChange={(e) => setRepoDescription(String(e.detail.value))}
                  rows={4}
                  disabled={loading}
                />
              </div>

              <div className="privacy-selector">
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                  🔐 Visibilidad del Repositorio
                </label>
                <IonSegment 
                  value={isPrivate ? 'private' : 'public'}
                  onIonChange={(e) => setIsPrivate(e.detail.value === 'private')}
                  disabled={loading}
                >
                  <IonSegmentButton value="public">
                    <IonIcon icon={globe}></IonIcon>
                    <IonLabel>Público</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="private">
                    <IonIcon icon={lockClosed}></IonIcon>
                    <IonLabel>Privado</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
                <p className="privacy-hint">
                  {isPrivate 
                    ? '🔒 Solo tú podrás acceder a este repositorio' 
                    : '🌐 Cualquiera puede ver este repositorio'}
                </p>
              </div>
            </div>

            <div className="form-actions">
              {loading ? (
                <div className="loading-container-inline">
                  <IonSpinner name="circular" />
                  <p>Creando tu repositorio...</p>
                </div>
              ) : (
                <>
                  <IonButton 
                    expand="block" 
                    color="primary"
                    onClick={handleCreateRepository}
                    style={{ '--padding-bottom': '12px', '--padding-top': '12px' } as any}
                  >
                    <IonIcon icon={informationCircle} slot="start"></IonIcon>
                    ✨ Crear Repositorio
                  </IonButton>
                  
                  <IonButton 
                    expand="block" 
                    fill="outline"
                    onClick={() => {
                      setRepoName('');
                      setRepoDescription('');
                      setIsPrivate(false);
                      setValidationError(null);
                    }}
                  >
                    🗑️ Limpiar Formulario
                  </IonButton>
                </>
              )}
            </div>
          </div>
        )}

        {error && (
          <IonAlert
            isOpen={showErrorAlert}
            onDidDismiss={() => setShowErrorAlert(false)}
            header="❌ Error al crear repositorio"
            message={error}
            buttons={['OK']}
            color="danger"
          />
        )}

        {success && (
          <IonToast
            isOpen={success}
            message={successMessage}
            duration={3000}
            position="top"
            color="success"
            onDidDismiss={() => setSuccess(false)}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
