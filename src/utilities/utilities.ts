import { promisify } from "util";
import path from "path";
import fs from "fs";
import { encode, decode } from "js-base64";
import express, { Router } from "express";
import jsonError from "../middleware/jsonError";

//#region ========== COMMON =========

/**
 * @description Method for decoding Base64 string
 * @param text string to decode
 */
export const decodeBase64 = function(text: string) {
  return decode(text);
};

/**
 * @description Method for encoding Base64 string
 * @param text string to encode
 */
export const encodeBase64 = function(text: string) {
  return encode(text);
};

/**
 * @description Method for sleeping thread
 * @param {number} ms number of miliseconds for thread to sleep
 */
export const snooze = function(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * @description Method for getting string in between characters
 * @param text String to get inner string from
 * @param firstCharacter first (opening) character to check
 * @param secondCharacter second (closing) character to check
 */
export const getStringBetweenCharacters = function(
  text: string,
  firstCharacter: string,
  secondCharacter: string
) {
  return text.substring(
    text.lastIndexOf(firstCharacter) + 1,
    text.lastIndexOf(secondCharacter)
  );
};

/**
 * @description Method for removing duplicates from array
 * @param array
 */
export const removeDuplicatesFromArray = function<T>(array: T[]): T[] {
  return [...new Set(array)];
};

/**
 * @description Method for checking wether string is a valid JSON
 * @param str String to check
 */
export const isStringAValidJSON = function(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

/**
 * @description Method to check wether arrays contain the same elements - order does not matter
 * @param array1 array 1 to check
 * @param array2 array 2 to check
 */
export const containsTheSameElements = function(
  array1: any[],
  array2: any[]
): boolean {
  if (array1.length !== array2.length) return false;

  for (let array1Element of array1) {
    if (!array2.includes(array1Element)) return false;
  }

  return true;
};

/**
 * @description Method to check wether arrays contain the same elements - order does not matter
 * @param array1 array 1 to check
 * @param array2 array 2 to check
 */
export const areObjectsIdentical = function(
  object1: { [key: string]: number | string | boolean },
  object2: { [key: string]: number | string | boolean }
): boolean {
  //Checking keys of both object
  let keysObject1 = Object.keys(object1);
  let keysObject2 = Object.keys(object2);

  if (!containsTheSameElements(keysObject1, keysObject2)) return false;

  //Checking values
  for (let object1Key of keysObject1) {
    if (object1[object1Key] !== object2[object1Key]) return false;
  }

  //Returns true if no difference was detected
  return true;
};
/**
 * @description Method for checking wether string is a numeric value
 * @param text string to check
 */
export function isNumeric(text: string) {
  return !isNaN(parseFloat(text));
}

/**
 * @description method for generating random string based on length
 * @param {Number} length Length of string to generate
 */
export function generateRandomString(length: number) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

/**
 * @description Method for cloning whole objects. NOTICE - Method uses JSON parsing and is very slow - use with caution!
 * @param object Object to clone
 */
export function cloneObject<T>(object: T) {
  return JSON.parse(JSON.stringify(object)) as T;
}

export function compareObjectsByValue(object1: any, object2: any) {
  return JSON.stringify(object1) === JSON.stringify(object2);
}

//#endregion ========== COMMON =========

//#region ========== EXPRESS ROUTES =========

/**
 * @description method for assigning JSON body parsing to Route. Applyning also a middleware to return 400 if body is not a valid json
 * @param {Object} express Express main object
 * @param {Object} router Express router object where parsing is to be applied
 */
export const applyJSONParsingToRoute = function(router: Router) {
  //assigning JSON parsing to router
  router.use(express.json());

  //assigning JSON parsing error validation
  router.use(jsonError);
};

//#endregion ========== EXPRESS ROUTES =========

//#region ========== IO METHODS =========

//Creating promise from non promise functions
export const statAsync = promisify(fs.stat);
export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);
export const readDirAsync = promisify(fs.readdir);
export const appendFileAsync = promisify(fs.appendFile);
export const createDirAsync = promisify(fs.mkdir);
export const unlinkAnsync = promisify(fs.unlink);
export const renameAsync = promisify(fs.rename);
export const rmdirAsync = promisify(fs.rmdir);

export const checkIfDirectoryExistsAsync = async function(
  directoryPath: string
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    fs.stat(directoryPath, function(err) {
      if (!err) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

export const createDirIfNotExists = async function(directoryPath: string) {
  const dirExists = await checkIfDirectoryExistsAsync(directoryPath);

  if (!dirExists) await createDirAsync(directoryPath);
};

export const checkIfFileExistsAsync = async function(
  filePath: string
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    fs.stat(filePath, function(err) {
      if (!err) {
        return resolve(true);
      }
      return resolve(false);
    });
  });
};

/**
 * @description Method for deleting file if file exists
 * @param {string} file file to delete if exists
 */
export const removeFileIfExistsAsync = async function(filePath: string) {
  let fileExists = await checkIfFileExistsAsync(filePath);
  if (fileExists) return unlinkAnsync(filePath);
};

/**
 * @description Method for deleting file
 * @param {string} file file or directory to delete
 */
export const removeFileOrDirectoryAsync = async function(
  filePath: string
): Promise<void> {
  return new Promise(function(resolve, reject) {
    fs.lstat(filePath, async function(err, stats) {
      if (err) {
        return reject(err);
      }
      if (stats.isDirectory()) {
        await rmdirAsync(filePath);
        resolve();
      } else {
        fs.unlink(filePath, function(err) {
          if (err) {
            return reject(err);
          }
          resolve();
        });
      }
    });
  });
};

/**
 * @description Method for clearing whole directory
 * @param {string} directory directory to clear
 */
export const clearDirectoryAsync = async function(
  directory: string
): Promise<void> {
  return new Promise(function(resolve, reject) {
    fs.access(directory, function(err) {
      if (err) {
        return reject(err);
      }
      fs.readdir(directory, function(err, files) {
        if (err) {
          return reject(err);
        }
        Promise.all(
          files.map(function(file) {
            var filePath = path.join(directory, file);
            return removeFileOrDirectoryAsync(filePath);
          })
        )
          .then(function() {
            return resolve();
          })
          .catch(reject);
      });
    });
  });
};

/**
 * @description Method for removing directory if it exists
 * @param {string} directoryPath directory to remove
 */
export const removeDirectoryIfExists = async function(directoryPath: string) {
  const dirExists = await checkIfDirectoryExistsAsync(directoryPath);

  if (dirExists) return rmdirAsync(directoryPath);
};

//#endregion ========== IO METHODS =========
