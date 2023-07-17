#!/bin/bash

SCRIPT_DIR=$( cd "${BASH_SOURCE[0]%\/*}" && pwd -P )

DIANA_VERSION="1.0.0.alpha"

if [[ "$DIANA_VERSION" == "" ]]; then
  echo "Can't find Diana project version."
  exit 1
fi
echo "DIANA_VERSION: ${DIANA_VERSION}"

DOCKERIMAGE="us.gcr.io/kyros-arion/diana-nginx:${DIANA_VERSION}"
DOCKERIMAGE_LATEST="us.gcr.io/kyros-arion/diana-nginx:latest"

DOCKERFILE="${SCRIPT_DIR}/Dockerfile"

echo Build nginx image: docker build --network host -t "${DOCKERIMAGE}" -t "${DOCKERIMAGE_LATEST}" -f "${DOCKERFILE}" "${SCRIPT_DIR}" && \
docker build --rm --network host -t "${DOCKERIMAGE}" -t "${DOCKERIMAGE_LATEST}" -f "${DOCKERFILE}" "${SCRIPT_DIR}"

status=$?

# Return the result of the docker command
exit ${status}
