import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %><%= classify(type) %> } from './<%= dasherize(name) %>.<%= dasherize(type) %>';

describe('<%= classify(name) %><%= classify(type) %>', () => {
  let <%= camelize(type) %>: <%= classify(name) %><%= classify(type) %>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    <%= camelize(type) %> = TestBed.inject(<%= classify(name) %><%= classify(type) %>);
  });

  it('should be created', () => {
    expect(<%= camelize(type) %>).toBeTruthy();
  });
});

