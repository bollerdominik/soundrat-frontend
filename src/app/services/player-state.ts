import {PlayerStatus} from './player-status';
import {TrackResponse} from '../api';
import {PlayerProgress} from './player-progress';

export interface PlayerState {
  status: PlayerStatus;
  progress: PlayerProgress;
  track: TrackResponse;
}
