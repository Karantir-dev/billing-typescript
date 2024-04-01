NAMESPACE=$1
SERVICE_ACCOUNT=$2
SECRET_NAME=$3
NAME=$NAMESPACE

current_context=$NAME
name_ci_cd=$SERVICE_ACCOUNT

server=$(kubectl config view --minify --output 'jsonpath={..cluster.server}')
cluster=$(kubectl config view --minify --output 'jsonpath={..context.cluster}')

ca=$(kubectl get secret "$SECRET_NAME" -o jsonpath='{.data.ca\.crt}' -n "$NAMESPACE")
token=$(kubectl get secret "$SECRET_NAME" -o jsonpath='{.data.token}' -n "$NAMESPACE" | base64 --decode)
namespace=$(kubectl get secret "$SECRET_NAME" -o jsonpath='{.data.namespace}' -n "$NAMESPACE" | base64 --decode)

echo "\
apiVersion: v1
kind: Config
clusters:
- name: ${cluster}
  cluster:
    certificate-authority-data: ${ca}
    server: ${server}
contexts:
- name: ${NAME}
  context:
    cluster: ${cluster}
    namespace: ${namespace}
    user: ${name_ci_cd}
current-context: ${current_context}
users:
- name: ${name_ci_cd}
  user:
    token: ${token}
" | base64 -w 0