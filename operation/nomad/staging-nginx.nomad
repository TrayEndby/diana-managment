job "nginx-staging" {
  datacenters = ["us-central1-a", "us-central1-b", "us-central1-c", "us-central1-f"]

  constraint {
    attribute = "${attr.unique.hostname}"
    regexp = "staging-webserver-[0-9]+"
  }

  group "nginx" {
    count = 1

    task "prepare" {
      driver = "docker"

      config {
        image = "gcr.io/google.com/cloudsdktool/cloud-sdk@sha256:88d07968b35b0525427955fcb0c4f01185a7a71ce7f9b48e8de72be90a97d469"

        volumes = [
          "/kyros:/kyros",
          "local/start.sh:/opt/start.sh",
        ]

        entrypoint = ["/bin/sh", "/opt/start.sh"]
      }

      template {
        data = <<EOF
mkdir -p /kyros/bucket
chmod 700 /kyros/bucket
gsutil -m rsync -d -r gs://kyros-diana-staging-frontend /kyros/bucket

if ! sha256sum -c /kyros/build-checksum.txt
then
  mkdir -p /kyros/www
  tar xzf /kyros/bucket/build.tgz --strip-components=1 -C /kyros/www
  sha256sum /kyros/bucket/build.tgz > /kyros/build-checksum.txt
fi

if ! sha256sum -c /kyros/certs-checksum.txt
then
  mkdir /kyros/certs
  chmod 700 /kyros/certs
  tar xzf /kyros/bucket/config/certs.tgz -C /kyros/certs
  sha256sum /kyros/bucket/config/certs.tgz > /kyros/certs-checksum.txt
fi
EOF

        destination   = "local/start.sh"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }

      lifecycle {
        hook    = "prestart"
        sidecar = false
      }
    }

    task "monitor" {
      driver = "docker"

      config {
        image = "gcr.io/google.com/cloudsdktool/cloud-sdk@sha256:88d07968b35b0525427955fcb0c4f01185a7a71ce7f9b48e8de72be90a97d469"

        volumes = [
          "/kyros:/kyros",
          "local/start.sh:/opt/start.sh",
        ]

        entrypoint = ["/bin/sh", "/opt/start.sh"]
      }

      template {
        data = <<EOF
while true; do
  gsutil -m rsync -d -r gs://kyros-diana-staging-frontend /kyros/bucket

  if ! sha256sum -c /kyros/build-checksum.txt
  then
    tar xzf /kyros/bucket/build.tgz --strip-components=1 -C /kyros/www
    sha256sum /kyros/bucket/build.tgz > /kyros/build-checksum.txt
  fi

  if ! sha256sum -c /kyros/certs-checksum.txt
  then
    tar xzf /kyros/bucket/config/certs.tgz -C /kyros/certs
    sha256sum /kyros/bucket/config/certs.tgz > /kyros/certs-checksum.txt
  fi
  sleep 60
done
EOF
        destination   = "local/start.sh"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }
    }

    task "nginx" {
      driver = "docker"
      leader = true

      config {
        image = "us.gcr.io/kyros-arion/diana-nginx@sha256:3c298a7b58e347c975b204b5e795402094c0f2e45a1cfcb26d63fe95c47e681b"

        volumes = [
          "/kyros/www:/var/www",
          "/kyros/certs:/usr/share/nginx",
          "/kyros/bucket/config/default.conf:/etc/nginx/conf.d/default.conf",
        ]

        mounts = [{
          type = "bind"
          target = "/etc/nginx/conf.d/extra"
          source = "local"
          readonly = true
          bind_options {
            propagation = "shared"
          }
        }]

        port_map {
          http = 80
          https = 443
          api = 25000
        }
      }

      template {
        data = <<EOF
upstream backend {
  ip_hash;
{{ range service "gateway" }}
  server {{ .Address }}:{{ .Port }};
{{ else }}server 127.0.0.1:65535; # force a 502
{{ end }}
}

server {
	 server_name staging.www.kyros.ai;
	 access_log  /var/log/nginx/api_access.log;
	 error_log   /var/log/nginx/api_error.log info;

   listen 25000 ssl;

   location / {
      proxy_pass http://backend;
   }

   ssl_certificate /usr/share/nginx/certificates/fullchain.pem;
	 ssl_certificate_key /usr/share/nginx/certificates/privkey.pem;
   include /etc/ssl-options/options-ssl-nginx.conf;
   ssl_dhparam /etc/ssl-options/ssl-dhparams.pem;
}
EOF

        destination   = "local/load-balancer.conf"
        change_mode   = "signal"
        change_signal = "SIGHUP"
      }

      resources {
        network {
          port "http" {
            static = 80
          }
          port "https" {
            static = 443
          }
          port "api" {
            static = 25000
          }
        }
      }

      service {
        name = "nginx-staging"
        port = "http"
        port = "https"
        port = "api"
      }
    }
  }
}
