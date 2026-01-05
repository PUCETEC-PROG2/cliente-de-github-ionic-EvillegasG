import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonInput,
  IonTextarea,
  IonCheckbox,
  IonLabel,
  IonItem,
  IonSpinner,
  IonNote,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { useState } from 'react';
import { Repository, UpdateRepositoryRequest } from '../services/githubService';
import './EditRepoModal.css';

interface EditRepoModalProps {
  isOpen: boolean;
  repository: Repository | null;
  onClose: () => void;
  onSave: (updateData: UpdateRepositoryRequest) => Promise<void>;
}

const EditRepoModal: React.FC<EditRepoModalProps> = ({
  isOpen,
  repository,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form when modal opens
  const handleDidEnter = () => {
    if (repository) {
      setName(repository.name);
      setDescription(repository.description || '');
      setIsPrivate(repository.private);
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('El nombre del repositorio es requerido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const updateData: UpdateRepositoryRequest = {
        name: name.trim(),
        description: description.trim() || undefined,
        private: isPrivate,
      };

      await onSave(updateData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el repositorio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonModal isOpen={isOpen} onIonModalDidPresent={handleDidEnter}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar Repositorio</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>
              <IonIcon icon={close}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="edit-modal-content">
        {error && (
          <div className="error-alert">
            <IonNote color="danger">
              <strong>Error:</strong> {error}
            </IonNote>
          </div>
        )}

        <IonItem>
          <IonLabel position="stacked">
            <strong>Nombre del Repositorio</strong>
          </IonLabel>
          <IonInput
            type="text"
            placeholder="Nombre del repositorio"
            value={name}
            onIonChange={(e) => setName(String(e.detail.value))}
            disabled={loading}
            clearInput
          />
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">
            <strong>Descripción</strong>
          </IonLabel>
          <IonTextarea
            placeholder="Descripción del repositorio"
            value={description}
            onIonChange={(e) => setDescription(String(e.detail.value))}
            rows={4}
            disabled={loading}
          />
        </IonItem>

        <IonItem>
          <IonCheckbox
            checked={isPrivate}
            onIonChange={(e) => setIsPrivate(e.detail.checked)}
            disabled={loading}
            slot="start"
          />
          <IonLabel>Repositorio Privado</IonLabel>
        </IonItem>

        <div className="modal-actions">
          {loading ? (
            <div className="loading-container">
              <IonSpinner name="circular" />
              <p>Actualizando repositorio...</p>
            </div>
          ) : (
            <>
              <IonButton
                expand="block"
                color="primary"
                onClick={handleSave}
              >
                ✓ Guardar Cambios
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                onClick={onClose}
              >
                Cancelar
              </IonButton>
            </>
          )}
        </div>
      </IonContent>
    </IonModal>
  );
};

export default EditRepoModal;
