export function testPrivateProperty(
  objectToTest: any,
  propertyName: string,
  expectedPropertyValue: any
) {
  expect(objectToTest[propertyName]).toEqual(expectedPropertyValue);
}

export function setPrivateProperty(
  objectToSet: any,
  propertyName: string,
  propertyValue: any
) {
  objectToSet[propertyName] = propertyValue;
}
