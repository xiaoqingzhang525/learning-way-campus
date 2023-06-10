import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import App from './App';
import store from './store/store';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
describe('App component', () => {
  it('renders without crashing', () => {
    shallow(
      <Provider store={store}>
        <App />
      </Provider>
    );
  });
});
