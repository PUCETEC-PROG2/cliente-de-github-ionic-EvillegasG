import { 
  IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, 
  IonSpinner, IonNote, IonRefresher, IonRefresherContent, IonAlert,
  IonToast, useIonViewWillEnter, useIonViewDidEnter
} from '@ionic/react';
import { useState } from 'react';
import React from 'react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import EditRepoModal from '../components/EditRepoModal';
import { 
  getUserRepositories, Repository, deleteRepository, 
  updateRepository, UpdateRepositoryRequest 
} from '../services/githubService';
import { GITHUB_TOKEN, GITHUB_USERNAME } from '../config/env';

const Tab1: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  
  // Delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [repoToDelete, setRepoToDelete] = useState<Repository | null>(null);
  
  // Feedback
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [operationError, setOperationError] = useState<string>('');

  // Flag para saber si es la primera carga
  const [isFirstLoad, setIsFirstLoad] = React.useState<boolean>(true);

  // Función para cargar repositorios
  const fetchRepositories = async (showSpinner: boolean = true) => {
    try {
      if (showSpinner) setLoading(true);
      setError(null);
      const repos = await getUserRepositories(GITHUB_USERNAME);
      
      // Ordenar por fecha de creación (más nuevos primero)
      const sortedRepos = repos.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      
      setRepositories(sortedRepos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
      setRepositories([]);
    } finally {
      if (showSpinner) setLoading(false);
    }
  };

  // ionViewWillEnter se ejecuta ANTES de que la vista entre completamente
  // Esto se dispara cada vez que Tab1 está a punto de ser visible
  const handleIonViewWillEnter = () => {
    console.log('Tab1 will enter - refreshing repositories');
    // Primera carga: con spinner
    // Siguientes cargas: sin spinner (background)
    fetchRepositories(isFirstLoad);
    if (isFirstLoad) {
      setIsFirstLoad(false);
    }
  };

  // ionViewDidEnter se ejecuta DESPUÉS de que la vista ha entrado
  const handleIonViewDidEnter = () => {
    console.log('Tab1 did enter');
  };

  // Hook que se ejecuta cuando la vista está a punto de entrar (más rápido)
  useIonViewWillEnter(() => {
    handleIonViewWillEnter();
  });

  // Hook que se ejecuta cuando la vista ha entrado completamente
  useIonViewDidEnter(() => {
    handleIonViewDidEnter();
  });

  // Manejador de refresco (pull-to-refresh)
  const handleRefresh = (event: CustomEvent) => {
    fetchRepositories(true).then(() => {
      (event.detail as any).complete();
    });
  };

  // Manejador de editar repositorio
  const handleEditRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    setEditModalOpen(true);
  };

  // Guardar cambios del repositorio
  const handleSaveChanges = async (updateData: UpdateRepositoryRequest) => {
    if (!selectedRepo) return;

    try {
      await updateRepository(GITHUB_USERNAME, selectedRepo.name, updateData, GITHUB_TOKEN);
      
      // Actualizar la lista local
      const updatedRepos = repositories.map((repo) =>
        repo.id === selectedRepo.id
          ? { ...repo, ...updateData }
          : repo
      );
      setRepositories(updatedRepos);
      setSuccessMessage(`✓ Repositorio "${selectedRepo.name}" actualizado exitosamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Error al actualizar');
      setTimeout(() => setOperationError(''), 3000);
    }
  };

  // Manejador de eliminar repositorio
  const handleDeleteRepo = (repo: Repository) => {
    setRepoToDelete(repo);
    setShowDeleteConfirm(true);
  };

  // Confirmar eliminación
  const confirmDelete = async () => {
    if (!repoToDelete) return;

    try {
      await deleteRepository(GITHUB_USERNAME, repoToDelete.name, GITHUB_TOKEN);
      
      // Actualizar lista local
      const updatedRepos = repositories.filter((repo) => repo.id !== repoToDelete.id);
      setRepositories(updatedRepos);
      
      setSuccessMessage(`✓ Repositorio "${repoToDelete.name}" eliminado exitosamente`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setOperationError(err instanceof Error ? err.message : 'Error al eliminar');
      setTimeout(() => setOperationError(''), 3000);
    } finally {
      setShowDeleteConfirm(false);
      setRepoToDelete(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mis Repositorios</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        {loading && (
          <div className="loading-container">
            <IonSpinner name="circular"></IonSpinner>
            <p>Cargando repositorios...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <IonNote color="danger">
              <strong>Error:</strong> {error}
            </IonNote>
          </div>
        )}

        {!loading && !error && repositories.length === 0 && (
          <div className="empty-container">
            <IonNote>No se encontraron repositorios para el usuario {GITHUB_USERNAME}</IonNote>
          </div>
        )}

        {!loading && !error && repositories.length > 0 && (
          <IonList>
            {repositories.map((repo) => (
              <RepoItem 
                key={repo.id} 
                {...repo}
                onEdit={handleEditRepo}
                onDelete={handleDeleteRepo}
              />
            ))}
          </IonList>
        )}
      </IonContent>

      {/* Edit Modal */}
      <EditRepoModal
        isOpen={editModalOpen}
        repository={selectedRepo}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedRepo(null);
        }}
        onSave={handleSaveChanges}
      />

      {/* Delete Confirmation Alert */}
      <IonAlert
        isOpen={showDeleteConfirm}
        onDidDismiss={() => setShowDeleteConfirm(false)}
        header="Eliminar Repositorio"
        message={`¿Estás seguro de que deseas eliminar "${repoToDelete?.name}"? Esta acción no se puede deshacer.`}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              setShowDeleteConfirm(false);
              setRepoToDelete(null);
            },
          },
          {
            text: 'Eliminar',
            role: 'destructive',
            handler: confirmDelete,
          },
        ]}
        color="danger"
      />

      {/* Success Toast */}
      <IonToast
        isOpen={!!successMessage}
        message={successMessage}
        duration={3000}
        position="top"
        color="success"
      />

      {/* Error Toast */}
      <IonToast
        isOpen={!!operationError}
        message={operationError}
        duration={3000}
        position="top"
        color="danger"
      />
    </IonPage>
  );
};

export default Tab1;
