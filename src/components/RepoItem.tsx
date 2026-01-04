import './RepoItem.css';
import React from 'react';
import {
  IonItem,
  IonLabel,
  IonThumbnail,
  IonBadge,
} from '@ionic/react';
import { Repository } from '../services/githubService';

interface RepoProps extends Repository {
  imageUrl?: string;
}

const RepoItem: React.FC<RepoProps> = ({ 
  name, 
  description, 
  stargazers_count, 
  language, 
  owner,
  html_url
}) => {
  return (
    <IonItem 
      button 
      detail
      onClick={() => window.open(html_url, '_blank')}
      className="repo-item"
    >
      <IonThumbnail slot="start">
        <img 
          alt={name} 
          src={owner?.avatar_url || "https://ionicframework.com/docs/img/demos/thumbnail.svg"} 
        />
      </IonThumbnail>
      <IonLabel>
        <div className="repo-header">
          <h2>{name}</h2>
          {language && <IonBadge color="primary">{language}</IonBadge>}
        </div>
        <p>{description || 'No description'}</p>
        <div className="repo-stats">
          <span>⭐ {stargazers_count} stars</span>
        </div>
      </IonLabel>
    </IonItem>
  );
};

export default RepoItem;
