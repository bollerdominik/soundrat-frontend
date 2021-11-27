import {ContextTypeRequest} from '../api';

export interface PlayerContext {
  type: ContextTypeRequest;
  userRoute?: string;
  collectionRoute?: string;
}
