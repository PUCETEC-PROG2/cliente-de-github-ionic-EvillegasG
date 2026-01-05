import './RepoItem.css';
import React from 'react';
import {
  IonItem,
  IonLabel,
  IonThumbnail,
  IonBadge,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { create, trash } from 'ionicons/icons';
import { Repository } from '../services/githubService';

interface RepoProps extends Repository {
  imageUrl?: string;
  onEdit?: (repo: Repository) => void;
  onDelete?: (repo: Repository) => void;
}

const RepoItem: React.FC<RepoProps> = ({ 
  name, 
  description, 
  stargazers_count, 
  language, 
  owner,
  html_url,
  onEdit,
  onDelete,
  ...repoData
}) => {
  const repo = { name, description, stargazers_count, language, owner, html_url, ...repoData };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(repo as Repository);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(repo as Repository);
    }
  };

  return (
    <IonItem 
      className="repo-item"
    >
      <IonThumbnail slot="start">
        <img 
          alt={name} 
          src={owner?.avatar_url || "https://ionicframework.com/docs/img/demos/thumbnail.svg"} 
        />
      </IonThumbnail>
      <IonLabel onClick={() => window.open(html_url, '_blank')}>
        <div className="repo-header">
          <h2>{name}</h2>
          {language && <IonBadge color="primary">{language}</IonBadge>}
        </div>
        <p>{description || 'No description'}</p>
        <div className="repo-stats">
          <span>⭐ {stargazers_count} stars</span>
        </div>
      </IonLabel>
      <div slot="end" className="repo-actions">
        {onEdit && (
          <IonButton 
            fill="clear" 
            color="primary"
            onClick={handleEditClick}
            title="Editar repositorio"
          >
            <IonIcon slot="icon-only" icon={create}></IonIcon>
          </IonButton>
        )}
        {onDelete && (
          <IonButton 
            fill="clear" 
            color="danger"
            onClick={handleDeleteClick}
            title="Eliminar repositorio"
          >
            <IonIcon slot="icon-only" icon={trash}></IonIcon>
          </IonButton>
        )}
      </div>
    </IonItem>
  );
};

export default RepoItem;
