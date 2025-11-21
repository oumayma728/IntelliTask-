using System.Net;
using System.Text.Json; //convert objects into JSON
//
public class ErrorHandlerMiddleware
{
    private readonly RequestDelegate _next; //type that represents a function that handles HTTP requests
    public ErrorHandlerMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex) //xception occurs anywhere downstream
        {
            Console.WriteLine(ex); //prints the error to the console for debugging.
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError; //return response status
            context.Response.ContentType = "application/json";
            var result = JsonSerializer.Serialize(new //Create JSON error message
            {
                error = ex.Message,//error message
                status = context.Response.StatusCode //response status
            });

            await context.Response.WriteAsync(result);
        }
    }
}
