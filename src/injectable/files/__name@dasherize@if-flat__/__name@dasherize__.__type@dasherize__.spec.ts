import { TestBed } from '@angular/core/testing';

import { <%= classify(name) %><%= classify(type) %> } from './<%= dasherize(name) %>.<%= dasherize(type) %>';

describe('<%= classify(name) %><%= classify(type) %>', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const <%= camelize(type) %>: <%= classify(name) %><%= classify(type) %> = TestBed.get(<%= classify(name) %><%= classify(type) %>);
    expect(<%= camelize(type) %>).toBeTruthy();
  });
});

