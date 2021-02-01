import { CreateWebStyles } from '../utils';

export const styles = CreateWebStyles({
  screenContainer: {
    flex: 1,
    flexBasis: 'auto'
  },
  devNoteContainer: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.36)'
  },
  devNote: {
    paddingLeft: 5,
    paddingRight: 5,
    color: 'white',
    fontSize: 15
  }
});
