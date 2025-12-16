## Use official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj files and restore dependencies first (caching)
COPY *.csproj ./
RUN dotnet restore
# Copy the rest of your code
COPY . ./

RUN dotnet publish -c Release -o out
# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app
#compile the app for Release mode and put all compiled files in a folder out.
COPY --from=build /app/out . 
# Expose port
EXPOSE 5000
#Run this ASP.NET app using the .NET runtime.
ENTRYPOINT ["dotnet", "smartTaskManager.dll"] 
