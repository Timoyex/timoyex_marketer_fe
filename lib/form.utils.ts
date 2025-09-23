export function getChangedValues<T extends Record<string, any>>(
  dirtyFields: Record<string, any>,
  allValues: T
): Partial<T> {
  const changedValues: Partial<T> = {};

  const extractChangedValues = (
    fields: Record<string, any>,
    values: Record<string, any>,
    result: Record<string, any>
  ) => {
    Object.keys(fields).forEach((key) => {
      if (
        typeof fields[key] === "object" &&
        fields[key] !== null &&
        !Array.isArray(fields[key])
      ) {
        // Nested object
        result[key] = {};
        extractChangedValues(fields[key], values[key] || {}, result[key]);

        // Remove empty nested objects
        if (Object.keys(result[key]).length === 0) {
          delete result[key];
        }
      } else if (fields[key]) {
        // Primitive value that changed
        result[key] = values[key];
      }
    });
  };

  extractChangedValues(dirtyFields, allValues, changedValues);
  return changedValues as Partial<T>;
}

export function simpleJsonToFormData(obj: any): FormData {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
    } else if (value !== null && value !== undefined) {
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value)
      );
    }
  });

  return formData;
}
