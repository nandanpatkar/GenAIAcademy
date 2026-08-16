# Pin an official stable release. Upgrade deliberately after testing flow compatibility in staging.
FROM langflowai/langflow:1.11.1

# Render routes traffic only after it observes a listener. Do not rely on the
# base image entrypoint: explicitly bind Langflow to the public container port.
EXPOSE 7860
CMD ["python", "-m", "langflow", "run", "--host", "0.0.0.0", "--port", "7860"]
