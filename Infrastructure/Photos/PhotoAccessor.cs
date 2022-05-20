using Application.Interfaces;
using System.Threading.Tasks;
using Application.Photos;
using Microsoft.AspNetCore.Http;
using CloudinaryDotNet;
using Microsoft.Extensions.Options;
using CloudinaryDotNet.Actions;

namespace Infrastructure.Photos
{
    public class PhotoAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public PhotoAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(config.Value.CloudName, config.Value.ApiKey, config.Value.ApiSecret);
            _cloudinary = new Cloudinary(account);
        }

        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if (file.Length <= 0) return null;
            await using var stream = file.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.Name, stream),
                Transformation = new Transformation().Width(500).Height(500).Crop("fill")
            };
            var result = await _cloudinary.UploadAsync(uploadParams);
            if (result.Error != null)
            {
                throw new System.Exception(result.Error.Message);
            }

            return new PhotoUploadResult
            {
                PublicId = result.PublicId,
                Url = result.SecureUrl.ToString()
            };
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}