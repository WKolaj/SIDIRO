export function testPrivateProperty(
  objectToTest: any,
  propertyName: string,
  expectedPropertyValue: any
) {
  expect(objectToTest[propertyName]).toEqual(expectedPropertyValue);
}

export function getPrivateProperty(objectToGet: any, propertyName: string) {
  return objectToGet[propertyName];
}

export function setPrivateProperty(
  objectToSet: any,
  propertyName: string,
  propertyValue: any
) {
  objectToSet[propertyName] = propertyValue;
}

export function invokePrivateMethod(
  objectToInvoke: any,
  methodName: string,
  methodArguments: any[] = []
) {
  return objectToInvoke[methodName](...methodArguments);
}
