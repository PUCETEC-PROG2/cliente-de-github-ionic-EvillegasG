import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSpinner,
  IonNote,
  IonBadge,
} from "@ionic/react";
import { useState, useEffect } from "react";
import "./Tab3.css";
import { getUserInfo, User } from "../services/githubService";

// GitHub username - can be changed to any username
const GITHUB_USERNAME = "EvillegasG";

const Tab3: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const userInfo = await getUserInfo(GITHUB_USERNAME);
        setUser(userInfo);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch user information");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Usuario</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mi Perfil</IonTitle>
          </IonToolbar>
        </IonHeader>

        {loading && (
          <div className="loading-container">
            <IonSpinner name="circular"></IonSpinner>
            <p>Cargando información del usuario...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <IonNote color="danger">
              <strong>Error:</strong> {error}
            </IonNote>
          </div>
        )}

        {!loading && !error && user && (
          <div className="card-container">
            <IonCard>
              <img
                alt={user.name}
                src={user.avatar_url}
                className="user-avatar"
              />
              <IonCardHeader>
                <IonCardTitle>{user.name || user.login}</IonCardTitle>
                <IonCardSubtitle>@{user.login}</IonCardSubtitle>
              </IonCardHeader>

              <IonCardContent>
                {user.bio && <p className="bio">{user.bio}</p>}

                <div className="user-info-grid">
                  <div className="info-item">
                    <span className="label">Repositorios Públicos</span>
                    <span className="value">{user.public_repos}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Seguidores</span>
                    <span className="value">{user.followers}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Siguiendo</span>
                    <span className="value">{user.following}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Gists Públicos</span>
                    <span className="value">{user.public_gists}</span>
                  </div>
                </div>

                {user.location && (
                  <div className="detail-row">
                    <strong>📍 Ubicación:</strong>
                    <span>{user.location}</span>
                  </div>
                )}

                {user.company && (
                  <div className="detail-row">
                    <strong>🏢 Empresa:</strong>
                    <span>{user.company}</span>
                  </div>
                )}

                {user.blog && (
                  <div className="detail-row">
                    <strong>🌐 Blog:</strong>
                    <a href={user.blog} target="_blank" rel="noopener noreferrer">
                      {user.blog}
                    </a>
                  </div>
                )}

                {user.twitter_username && (
                  <div className="detail-row">
                    <strong>𝕏 Twitter:</strong>
                    <span>@{user.twitter_username}</span>
                  </div>
                )}

                <div className="action-buttons">
                  <IonBadge
                    color="primary"
                    className="badge-link"
                    onClick={() => window.open(user.html_url, "_blank")}
                  >
                    Ver en GitHub
                  </IonBadge>
                </div>

                <div className="timestamp">
                  <small>
                    Perfil creado: {new Date(user.created_at).toLocaleDateString("es-ES")}
                  </small>
                </div>
              </IonCardContent>
            </IonCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
