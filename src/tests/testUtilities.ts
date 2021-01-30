export function testPrivateProperty(
  objectToTest: any,
  propertyName: string,
  expectedPropertyValue: any
) {
  expect(objectToTest[propertyName]).toEqual(expectedPropertyValue);
}
