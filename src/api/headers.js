export async function addHeader(requestObj, methodType) {
    const requestOptions = {
      method: methodType,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestObj),
    };
    return requestOptions;
  }
  
  export async function addHeaderWithOutBody(methodType) {
    const requestOptions = {
      method: methodType,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    return requestOptions;
  }
  