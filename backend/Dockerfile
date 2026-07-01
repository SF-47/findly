# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY *.csproj ./
RUN dotnet restore

# Copy the remaining source code and build the application
COPY . ./
RUN dotnet publish backend.csproj -c Release -o /out

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /out ./

# By default, ASP.NET Core 8+ uses port 8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "backend.dll"]
