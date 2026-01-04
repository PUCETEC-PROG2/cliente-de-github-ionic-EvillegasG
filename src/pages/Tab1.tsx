import { IonContent, IonHeader, IonList, IonPage, IonTitle, IonToolbar, IonSpinner, IonNote } from '@ionic/react';
import { useState, useEffect } from 'react';
import './Tab1.css';
import RepoItem from '../components/RepoItem';
import { getUserRepositories, Repository } from '../services/githubService';

// GitHub username - can be changed to any username
const GITHUB_USERNAME = 'EvillegasG';

const Tab1: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError(null);
        const repos = await getUserRepositories(GITHUB_USERNAME);
        setRepositories(repos);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
        setRepositories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Repositorios</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
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
              <RepoItem key={repo.id} {...repo} />
            ))}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
