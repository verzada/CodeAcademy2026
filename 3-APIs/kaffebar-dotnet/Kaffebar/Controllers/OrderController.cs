using Kaffebar.DTO;
using Kaffebar.Models;
using Kaffebar.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace Kaffebar.Controllers
{
    [ApiController]
    [Route("orders")]
    public class OrderController : ControllerBase
    {
        private readonly OrderRepository _orderRepository;

        public OrderController(OrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        [HttpGet("{orderId:guid}")]
        public async Task<Results<Ok<Order>, NotFound, ValidationProblem>> Get(Guid orderId)
        {
            if (orderId == Guid.Empty)
            {
                var errors = new Dictionary<string, string[]>
                {
                    {"OrderId", new [] {"OrderId cannot be empty"} }
                };

                return TypedResults.ValidationProblem(errors);
            }

            var order = _orderRepository.GetById(orderId);

            if (order == null)
            {
                return TypedResults.NotFound();
            }

            return TypedResults.Ok(order);
        }

        [HttpPost()]
        public async Task<Results<Created<Order>, BadRequest>> Post(NewOrder newOrder)
        {
            var order = new Order()
            {
                Id = Guid.NewGuid(),
                CustomerName = newOrder.CustomerName,
                CoffeId = newOrder.CoffeId,
                Quantity = newOrder.Quantity,
                Size = newOrder.Size,
                MilkType = newOrder.MilkType,
                ExtraShot = newOrder.ExtraShot,
                Status = OrderStatus.PENDING
            };


            var createdOrder = _orderRepository.Add(order);
            return TypedResults.Created($"/orders/{createdOrder.Id}", createdOrder);
        }

        [HttpPatch("{orderId:guid}")]
        public async Task<Results<Ok, NotFound, BadRequest>> Patch(Guid orderId, [FromQuery] string status)
        {
            var entityOrder = _orderRepository.GetById(orderId);
            if (entityOrder == null)
            {
                return TypedResults.NotFound();
            }

            if (Enum.TryParse<OrderStatus>(status, true, out var patchedStatus))
            {
                entityOrder.Status = patchedStatus;
                _orderRepository.Update(entityOrder);
                return TypedResults.Ok();
            }
            return TypedResults.BadRequest();
        }
    }
}
