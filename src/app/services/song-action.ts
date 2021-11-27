import {TrackResponse} from '../api';
import {PlayerStatus} from './player-status';
import {PlayerContext} from './player-context';

export class SongAction {
  status: PlayerStatus;
  track?: TrackResponse;
  context?: PlayerContext;
}

