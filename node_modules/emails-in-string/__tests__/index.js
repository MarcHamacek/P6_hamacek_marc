var emailsInString = require('../');

describe('emails-in-string', () => {
  test('is a function', () => {
    expect(typeof emailsInString).toBe('function');
  });

  test('should return unique emails', () => {
    const input = emailsInString('test1@test.com, test2@test.com, test1@test.com, test2@test.com');
    const expected = ['test1@test.com', 'test2@test.com'];
    expect(input).toEqual(expected);
  });

  test('should return lowercase emails', () => {
    const input = emailsInString('TEST1@TEST.COM');
    const expected = ['test1@test.com'];
    expect(input).toEqual(expected);
  });

  test('should return an empty array when no text is provided', () => {
    const input = emailsInString();
    const expected = [];
    expect(input).toEqual(expected);
  });

  test('should return an empty array when no emails are provided', () => {
    const input = emailsInString('there are no email addresses in this string');
    const expected = [];
    expect(input).toEqual(expected);
  });

  test('should filter out twitter usernames', () => {
    const input = emailsInString('this is my @twitterusername');
    const expected = [];
    expect(input).toEqual(expected);
  });

  test('should filter out email addresses with 2 "." characters', () => {
    const input = emailsInString('test1@test..com');
    const expected = [];
    expect(input).toEqual(expected);
  });

  test('should filter out email addresses with 2 "@" characters', () => {
    const input = emailsInString('test1@@test.com');
    const expected = [];
    expect(input).toEqual(expected);
  });

  test('allows email addresses with a "+" character', () => {
    const input = emailsInString('test+1@test.com');
    const expected = ['test+1@test.com'];
    expect(input).toEqual(expected);
  });
});
